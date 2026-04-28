import { NextResponse } from 'next/server';
import { fetchPage } from '@/fetch';

export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export function corsPreflight() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export function jsonOk<T>(body: T) {
  return NextResponse.json(body, { headers: CORS_HEADERS });
}

export function jsonError(error: unknown, fallback: string, status = 500) {
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json(
    { error: message },
    { status, headers: CORS_HEADERS },
  );
}

export async function resolveHtmlInput(body: any): Promise<{ url: string; html: string }> {
  if (typeof body?.html === 'string' && body.html.length > 0) {
    return { url: body.url || 'inline://html', html: body.html };
  }

  if (typeof body?.url === 'string' && body.url.length > 0) {
    const fetched = await fetchPage(body.url, {
      browser: body.browser,
      verbose: body.verbose,
    });
    return { url: fetched.url, html: fetched.html };
  }

  throw new Error('Provide either html or url');
}
