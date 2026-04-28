import { load } from 'cheerio';
import { scan, type ScanOptions, type ScanResult } from './scanner';
import type { PatternMatch } from './patterns/types';

export type GuardPolicy = 'warn' | 'sanitize' | 'block' | 'strict';
export type RiskThreshold = ScanResult['riskLevel'];

export interface SanitizeResult {
  html: string;
  text: string;
  removedFragments: number;
  removedPatterns: string[];
}

export interface GuardOptions extends ScanOptions {
  policy?: GuardPolicy;
  threshold?: RiskThreshold;
}

export interface GuardResult {
  url: string;
  policy: GuardPolicy;
  blocked: boolean;
  blockReason: string | null;
  scan: ScanResult;
  sanitized: SanitizeResult;
}

const RISK_ORDER: Record<RiskThreshold, number> = {
  clean: 0,
  suspicious: 1,
  high: 2,
  critical: 3,
};

const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\uFEFF\u2060]/g;

export function riskMeetsThreshold(level: RiskThreshold, threshold: RiskThreshold): boolean {
  return RISK_ORDER[level] >= RISK_ORDER[threshold];
}

function normalizePolicy(policy?: string): GuardPolicy {
  if (policy === 'sanitize' || policy === 'block' || policy === 'strict') return policy;
  return 'warn';
}

function normalizeThreshold(threshold?: string): RiskThreshold {
  if (threshold === 'suspicious' || threshold === 'high' || threshold === 'critical' || threshold === 'clean') {
    return threshold;
  }
  return 'high';
}

function normalizeFragment(text: string): string {
  return text
    .replace(ZERO_WIDTH_CHARS, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeSelect($: ReturnType<typeof load>, selector: string) {
  try {
    return $(selector);
  } catch {
    return $();
  }
}

function removeMetaMatch($: ReturnType<typeof load>, match: PatternMatch): boolean {
  const name = match.location.match(/name="([^"]+)"/)?.[1];
  const fragment = normalizeFragment(match.extractedText).slice(0, 80);
  let removed = false;

  $('meta').each((_, el) => {
    const $el = $(el);
    const content = $el.attr('content') || '';
    if (name && ($el.attr('name') || '').toLowerCase() !== name.toLowerCase()) return;
    if (fragment && !normalizeFragment(content).includes(fragment)) return;
    $el.remove();
    removed = true;
  });

  return removed;
}

function removeElementByLocation($: ReturnType<typeof load>, match: PatternMatch): boolean {
  const fragment = normalizeFragment(match.extractedText).slice(0, 80);
  const selected = safeSelect($, match.location);

  if (selected.length > 0) {
    let removed = false;
    selected.each((_, el) => {
      const text = normalizeFragment($(el).text());
      if (!fragment || text.includes(fragment)) {
        $(el).remove();
        removed = true;
      }
    });
    if (removed) return true;
  }

  $('body *').each((_, el) => {
    if (selected.length > 0) return;
    const text = normalizeFragment($(el).text());
    if (fragment && text.includes(fragment)) {
      $(el).remove();
    }
  });

  return fragment.length > 0 && normalizeFragment($('body').text()).includes(fragment) === false;
}

export function sanitizeHtml(html: string, matches: PatternMatch[]): SanitizeResult {
  let workingHtml = html.replace(ZERO_WIDTH_CHARS, '');
  const $ = load(workingHtml);
  const removedPatterns = new Set<string>();
  let removedFragments = 0;

  for (const match of matches) {
    let removed = false;

    if (match.patternId === 'zero-width') {
      removed = html !== workingHtml;
    } else if (match.patternId === 'suspicious-meta') {
      removed = removeMetaMatch($, match);
    } else {
      removed = removeElementByLocation($, match);
    }

    if (removed) {
      removedFragments += 1;
      removedPatterns.add(match.patternId);
    }
  }

  workingHtml = $.html();

  return {
    html: workingHtml,
    text: normalizeFragment($.root().text()),
    removedFragments,
    removedPatterns: Array.from(removedPatterns),
  };
}

export async function guard(url: string, html: string, options?: GuardOptions): Promise<GuardResult> {
  const policy = normalizePolicy(options?.policy);
  const threshold = normalizeThreshold(options?.threshold);
  const scanResult = await scan(url, html, options);
  const sanitized = sanitizeHtml(html, scanResult.patterns);

  let blocked = false;
  let blockReason: string | null = null;

  if (policy === 'strict' && scanResult.patterns.length > 0) {
    blocked = true;
    blockReason = `strict policy blocked ${scanResult.patterns.length} detected pattern(s)`;
  } else if (policy === 'block' && riskMeetsThreshold(scanResult.riskLevel, threshold)) {
    blocked = true;
    blockReason = `${scanResult.riskLevel} risk meets ${threshold} threshold`;
  }

  return {
    url,
    policy,
    blocked,
    blockReason,
    scan: scanResult,
    sanitized,
  };
}
