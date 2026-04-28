#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import { fetchPage } from '../src/fetch.ts';
import { guard } from '../src/guard.ts';
import { printConsole, printJson, generateMarkdown } from '../src/report.ts';
import { writeFileSync } from 'fs';

const program = new Command();

program
  .name('injectscan')
  .description('Detect hidden prompt injection in web pages and documents')
  .version('0.1.0')
  .argument('<target>', 'URL or file path to scan')
  .option('-j, --json', 'Output results as JSON')
  .option('-s, --simulate', 'Run simulation mode (Tier 2)')
  .option('-m, --markdown', 'Output results as Markdown')
  .option('--sanitize', 'Remove risky fragments from HTML; with --output writes sanitized HTML')
  .option('--policy <policy>', 'Guard policy: warn|sanitize|block|strict', 'warn')
  .option('--fail-on <level>', 'Exit non-zero at risk level: suspicious|high|critical', 'high')
  .option('-b, --browser [engine]', 'Use headless browser: auto|playwright|lightpanda (default: auto)')
  .option('-o, --output <file>', 'Save results to file')
  .option('-v, --verbose', 'Verbose logging')
  .action(async (target, options) => {
    try {
      // 1. Fetch HTML
      if (options.verbose) console.error(`[InjectScan] Fetching: ${target}`);
      const { url, html } = await fetchPage(target, {
        browser: options.browser,
        verbose: options.verbose,
      });

      // 2. Guard (scan + optional sanitize/block policy)
      if (options.verbose) console.error(`[InjectScan] Scanning...`);
      const guardResult = await guard(url, html, {
        json: options.json,
        simulate: options.simulate,
        verbose: options.verbose,
        policy: options.sanitize ? 'sanitize' : options.policy,
        threshold: options.failOn,
      });
      const result = guardResult.scan;
      const shouldSanitize = options.sanitize || guardResult.policy === 'sanitize';

      // 3. Output
      if (options.json) {
        printJson(shouldSanitize || options.policy !== 'warn' ? guardResult : result);
      } else if (options.markdown) {
        console.log(generateMarkdown(result));
      } else {
        printConsole(result);
        if (shouldSanitize) {
          console.log(`  Sanitized: removed ${guardResult.sanitized.removedFragments} fragment(s)`);
          console.log('');
        }
        if (guardResult.blocked) {
          console.error(`[InjectScan] Blocked: ${guardResult.blockReason}`);
        }
      }

      // 4. File output
      if (options.output) {
        const content = shouldSanitize
          ? guardResult.sanitized.html
          : options.markdown
          ? generateMarkdown(result)
          : JSON.stringify(result, null, 2);
        writeFileSync(options.output, content, 'utf-8');
        console.error(`[InjectScan] Results saved to ${options.output}`);
      }

      // Exit code: non-zero when blocked or configured threshold is met
      if (guardResult.blocked || riskMeetsFailOn(result.riskLevel, options.failOn)) {
        process.exit(1);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('HTTP 403') || msg.includes('HTTP 406')) {
        console.error(`[InjectScan] ❌ 봇 차단: 이 사이트는 자동화된 접근을 차단합니다.`);
        console.error(`  → --browser 옵션으로 재시도: npm run scan -- --browser ${target}`);
      } else if (msg.includes('HTTP 5')) {
        console.error(`[InjectScan] ❌ 서버 오류: 대상 사이트가 응답하지 않습니다 (${msg})`);
      } else if (msg.includes('timeout') || msg.includes('Timeout')) {
        console.error(`[InjectScan] ❌ 시간 초과: 사이트가 응답하지 않습니다. 네트워크를 확인하세요.`);
      } else if (msg.includes('ENOTFOUND') || msg.includes('getaddrinfo')) {
        console.error(`[InjectScan] ❌ DNS 실패: 사이트를 찾을 수 없습니다. URL을 확인하세요.`);
      } else {
        console.error(`[InjectScan] ❌ 오류: ${msg}`);
      }
      process.exit(2);
    }
  });

program.parse();

function riskMeetsFailOn(level, threshold) {
  const order = { clean: 0, suspicious: 1, high: 2, critical: 3 };
  return order[level] >= order[threshold || 'high'];
}
