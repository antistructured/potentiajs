import { describe, expect, test } from 'bun:test';

import { fail, json, ok, redirect, text } from '../src/index.js';
import { toResponse } from '../src/kernel/response.js';

describe('kernel result and response helpers', () => {
  test('ok returns a stable success shape', () => {
    expect(Object.keys(ok('value'))).toEqual(['ok', 'value', 'error', 'meta']);
    expect(ok('value')).toEqual({ ok: true, value: 'value', error: null, meta: null });
  });

  test('fail returns a stable failure shape with normalized error', () => {
    const result = fail(new Error('boom'));

    expect(Object.keys(result)).toEqual(['ok', 'value', 'error', 'meta']);
    expect(result.ok).toBe(false);
    expect(result.value).toBe(null);
    expect(result.error).toEqual({ code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error', status: 500, details: null });
    expect(result.meta).toBe(null);
  });

  test('json converts to native Response', async () => {
    const response = toResponse(json({ message: 'hello' }, { status: 201 }));

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ message: 'hello' });
  });

  test('text converts to native Response', async () => {
    const response = toResponse(text('hello', { status: 202 }));

    expect(response.status).toBe(202);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('hello');
  });

  test('redirect produces a redirect response', () => {
    const response = toResponse(redirect('/next', 302));

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/next');
  });

  test('thrown errors normalize safely', async () => {
    const response = toResponse(new Error('secret failure'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('unknown values produce deterministic JSON responses', async () => {
    const response = toResponse({ value: 1 });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ value: 1 });
  });
});
