import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel contract diagnostics', () => {
  test('params failure includes boundary', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: sigil({ id: Number }) })] });

    const response = await app.fetch(new Request('http://local.test/users/abc'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.code).toBe('POTENTIA_CONTRACT_FAILED');
    expect(body.error.boundary).toBe('params');
    expect(body.error.issues).toMatchObject([{ message: 'SigilJS contract rejected value' }]);
  });

  test('query failure includes boundary', async () => {
    const app = createApp({ routes: [route('GET', '/search', () => ok(json({ ok: true })), { query: sigil({ page: Number }) })] });

    const response = await app.fetch(new Request('http://local.test/search?page=nope'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.boundary).toBe('query');
    expect(body.error.issues).toMatchObject([{ message: 'SigilJS contract rejected value' }]);
  });

  test('headers failure includes boundary', async () => {
    const app = createApp({ routes: [route('GET', '/headers', () => ok(json({ ok: true })), { headers: sigil({ 'x-mode': String }) })] });

    const response = await app.fetch(new Request('http://local.test/headers'));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.boundary).toBe('headers');
  });

  test('body failure includes boundary', async () => {
    const app = createApp({ routes: [route('POST', '/users', () => ok(json({ ok: true })), { body: sigil({ name: String }) })] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 123 })
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.boundary).toBe('body');
  });

  test('response failure uses response contract code and boundary', async () => {
    const app = createApp({ routes: [route('GET', '/users', () => ok(json({ id: 1 })), { response: sigil({ id: String }) })] });

    const response = await app.fetch(new Request('http://local.test/users'));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('POTENTIA_RESPONSE_CONTRACT_FAILED');
    expect(body.error.boundary).toBe('response');
    expect(body.error.issues).toMatchObject([{ message: 'SigilJS contract rejected value' }]);
  });

  test('raw unsafe input is not exposed', async () => {
    const app = createApp({ routes: [route('POST', '/users', () => ok(json({ ok: true })), { body: () => { throw new Error('secret-token-123'); } })] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ secret: 'secret-token-123' })
    }));
    const text = await response.text();

    expect(text.includes('secret-token-123')).toBe(false);
    expect(JSON.parse(text).error.boundary).toBe('body');
  });

  test('SigilJS thrown error normalizes safely', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: sigil({ id: Number }) })] });

    const response = await app.fetch(new Request('http://local.test/users/abc'));
    const text = await response.text();

    expect(text.includes('Expected property')).toBe(false);
    expect(JSON.parse(text).error.issues).toMatchObject([{ message: 'SigilJS contract rejected value' }]);
  });

  test('generic thrown error normalizes safely', async () => {
    const app = createApp({ routes: [route('GET', '/search', () => ok(json({ ok: true })), { query: () => { throw new Error('generic secret'); } })] });

    const response = await app.fetch(new Request('http://local.test/search?q=x'));
    const text = await response.text();

    expect(text.includes('generic secret')).toBe(false);
    expect(JSON.parse(text).error).toMatchObject({
      code: 'POTENTIA_CONTRACT_FAILED',
      message: 'Query failed contract validation',
      boundary: 'query',
      issues: [{ message: 'Contract parser rejected value' }]
    });
  });
});
