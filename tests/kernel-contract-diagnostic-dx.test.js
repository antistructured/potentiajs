import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel contract diagnostic DX', () => {
  test('params diagnostics include boundary and stable issue array', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: { check: () => false } })] });

    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: {
        code: 'POTENTIA_CONTRACT_FAILED',
        message: 'Params failed contract validation',
        boundary: 'params',
        issues: [{ message: 'Contract check returned false' }]
      }
    });
  });

  test('query diagnostics include boundary', async () => {
    const app = createApp({ routes: [route('GET', '/search', () => ok(json({ ok: true })), { query: () => { throw new Error('secret query parser'); } })] });

    const response = await app.fetch(new Request('http://local.test/search'));

    expect(response.status).toBe(400);
    expect((await response.json()).error).toEqual({
      code: 'POTENTIA_CONTRACT_FAILED',
      message: 'Query failed contract validation',
      boundary: 'query',
      issues: [{ message: 'Contract parser rejected value' }]
    });
  });

  test('headers diagnostics include boundary', async () => {
    const app = createApp({ routes: [route('GET', '/secure', () => ok(json({ ok: true })), { headers: sigil({ 'x-auth': String }) })] });

    const response = await app.fetch(new Request('http://local.test/secure'));

    expect(response.status).toBe(400);
    expect((await response.json()).error).toEqual({
      code: 'POTENTIA_CONTRACT_FAILED',
      message: 'Headers failed contract validation',
      boundary: 'headers',
      issues: [{ message: 'SigilJS contract rejected value' }]
    });
  });

  test('body diagnostics include boundary', async () => {
    const app = createApp({ routes: [route('POST', '/items', () => ok(json({ ok: true })), { body: { parse() { throw new Error('secret body parser'); } } })] });

    const response = await app.fetch(new Request('http://local.test/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ unsafe: 'raw body must not appear' })
    }));

    const body = await response.json();
    expect(body.error.boundary).toBe('body');
    expect(body.error.issues).toEqual([{ message: 'Contract parser rejected value' }]);
    expect(JSON.stringify(body)).not.toContain('raw body must not appear');
    expect(JSON.stringify(body)).not.toContain('secret body parser');
  });

  test('response diagnostics hide unsafe internals', async () => {
    const app = createApp({ routes: [route('GET', '/items', () => ok(json({ ok: true })), { response() { throw new Error('secret response parser'); } })] });

    const response = await app.fetch(new Request('http://local.test/items'));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toEqual({
      code: 'POTENTIA_RESPONSE_CONTRACT_FAILED',
      message: 'Response failed contract validation',
      boundary: 'response',
      issues: [{ message: 'Contract parser rejected value' }]
    });
    expect(JSON.stringify(body)).not.toContain('secret response parser');
  });

  test('SigilJS diagnostics are deterministic and safe', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: sigil({ id: Number }) })] });

    const response = await app.fetch(new Request('http://local.test/users/not-a-number'));

    expect(await response.json()).toEqual({
      error: {
        code: 'POTENTIA_CONTRACT_FAILED',
        message: 'Params failed contract validation',
        boundary: 'params',
        issues: [{ message: 'SigilJS contract rejected value' }]
      }
    });
  });
});
