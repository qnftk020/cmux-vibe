# InjectScan

InjectScan is a context firewall for AI-readable web content. It scans web pages before an AI agent, browser automation, or RAG pipeline consumes them, then flags, removes, or blocks hidden prompt-injection instructions.

## Why

Modern AI systems increasingly read arbitrary web pages. Those pages can contain instructions that are invisible to humans but visible to models, such as white-on-white text, zero-width characters, hidden CSS, off-screen elements, ARIA-hidden content, or suspicious metadata.

InjectScan is designed for the step before model ingestion:

1. Detect risky fragments.
2. Explain why they are suspicious.
3. Sanitize unsafe content.
4. Block content based on policy.

## Product Direction

InjectScan should not promise perfect prevention. The product stance is defense-in-depth:

- **Scanner**: find hidden prompt-injection patterns.
- **Sanitizer**: remove or normalize risky fragments.
- **Policy engine**: decide whether to warn, sanitize, block, or run strict mode.
- **Agent guard**: return safe content for downstream AI agents.

Short-term positioning: **prompt injection scanner**.

Long-term positioning: **context firewall for AI agents**.

## Install

```bash
npm install
```

For browser fallback scanning:

```bash
npx playwright install chromium
```

## CLI Usage

Scan a URL:

```bash
npm run scan -- https://example.com
```

Scan a local HTML file:

```bash
npm run scan -- ./page.html
```

Write sanitized HTML:

```bash
npm run scan -- ./page.html --sanitize --output clean.html
```

Block on high or critical risk:

```bash
npm run scan -- https://example.com --policy block --fail-on high
```

Strict mode blocks if any pattern is detected:

```bash
npm run scan -- ./page.html --policy strict
```

JSON output:

```bash
npm run scan -- ./page.html --json
```

## Guard Policies

| Policy | Behavior |
| --- | --- |
| `warn` | Scan and report only. |
| `sanitize` | Scan and remove risky fragments from generated safe content. |
| `block` | Block when the risk level meets `--fail-on`. |
| `strict` | Block when any suspicious pattern is found. |

Risk levels are `clean`, `suspicious`, `high`, and `critical`.

## Programmatic API

```ts
import { guard } from './src/guard.js';

const result = await guard(url, html, {
  policy: 'sanitize',
  threshold: 'high',
});

if (result.blocked) {
  throw new Error(result.blockReason ?? 'Blocked by InjectScan');
}

agent.run(result.sanitized.text);
```

Hosted API shape:

```http
POST /api/guard
Content-Type: application/json
```

```json
{
  "url": "https://example.com",
  "policy": "sanitize",
  "threshold": "high"
}
```

You can also pass inline HTML:

```json
{
  "html": "<html>...</html>",
  "policy": "block",
  "threshold": "suspicious"
}
```

## Detection Layers

Layer 1 static scanners:

- White-on-white or transparent text
- Zero-width characters
- Hidden CSS
- Off-screen positioning
- Tiny font sizes
- Suspicious meta tags
- ARIA-hidden instruction text

Layer 2 and 3, when configured:

- PMI signature matching
- Embedding similarity
- LLM-as-judge
- Simulation mode

## Web Demo

The current web entry redirects to `public/bookmarklet.html`, which provides a bookmarklet and in-page widget demo.

## Development

```bash
npm run build
npm run typecheck
```

## Security Notes

Prompt injection cannot be solved with a single detector. Treat InjectScan as a guardrail before model ingestion, not as a guarantee. For production deployments, add API authentication, rate limiting, audit logs, and domain-level policy controls.
