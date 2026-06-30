import { describe, expect, test } from 'bun:test';
import { sigil, optional } from '@weipertda/sigiljs';

import { createApp, json, ok, route } from '../src/index.js';
import { isSigilContract, normalizeContract } from '../src/kernel/contract.js';

describe('kernel native SigilJS contracts', () => {
  test('adapter recognizes real SigilJS contracts', () => {
    const Contract = sigil({ id: String });
    const adapter = normalizeContract(Contract);

    expect(isSigilContract(Contract)).toBe(true);
    expect(adapter.kind).toBe('sigil');
    expect(adapter.project().kind).toBe('sigil');
  });

  test('SigilJS params contract works', async () => {
    const Params = sigil({ id: String });
    const app = createApp({ routes: [route('GET', '/users/:id', (ctx) => ok(json(ctx.params)), { params: Params })] });

    const response = await app.fetch(new Request('http://local.test/users/abc'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'abc' });
  });

  test('SigilJS query contract works', async () => {
    const Query = sigil({ include: optional(String) });
    const app = createApp({ routes: [route('GET', '/users', (ctx) => ok(json(ctx.query)), { query: Query })] });

    const response = await app.fetch(new Request('http://local.test/users?include=posts'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ include: 'posts' });
  });

  test('SigilJS headers contract works', async () => {
    const HeadersContract = sigil({ 'x-mode': String });
    const app = createApp({ routes: [route('GET', '/headers', (ctx) => ok(json({ mode: ctx.headers['x-mode'] })), { headers: HeadersContract })] });

    const response = await app.fetch(new Request('http://local.test/headers', { headers: { 'x-mode': 'sigil' } }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ mode: 'sigil' });
  });

  test('SigilJS body contract works', async () => {
    const Body = sigil({ name: String });
    const app = createApp({ routes: [route('POST', '/users', (ctx) => ok(json(ctx.body)), { body: Body })] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Ada' });
  });

  test('SigilJS response contract works', async () => {
    const ResponseContract = sigil({ id: String, name: String });
    const app = createApp({ routes: [route('GET', '/users/1', () => ok(json({ id: '1', name: 'Ada' })), { response: ResponseContract })] });

    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: '1', name: 'Ada' });
  });

  test('failed SigilJS params contract returns deterministic 400', async () => {
    const Params = sigil({ id: Number });
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: Params })] });

    const response = await app.fetch(new Request('http://local.test/users/not-number'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Params failed contract validation', boundary: 'params', issues: [{ message: 'SigilJS contract rejected value' }] } });
  });

  test('failed SigilJS query contract returns deterministic 400', async () => {
    const Query = sigil({ page: Number });
    const app = createApp({ routes: [route('GET', '/search', () => ok(json({ ok: true })), { query: Query })] });

    const response = await app.fetch(new Request('http://local.test/search?page=one'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Query failed contract validation', boundary: 'query', issues: [{ message: 'SigilJS contract rejected value' }] } });
  });

  test('failed SigilJS headers contract returns deterministic 400', async () => {
    const HeadersContract = sigil({ 'x-mode': String });
    const app = createApp({ routes: [route('GET', '/headers', () => ok(json({ ok: true })), { headers: HeadersContract })] });

    const response = await app.fetch(new Request('http://local.test/headers'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Headers failed contract validation', boundary: 'headers', issues: [{ message: 'SigilJS contract rejected value' }] } });
  });

  test('failed SigilJS body contract returns deterministic 400', async () => {
    const Body = sigil({ name: String });
    const app = createApp({ routes: [route('POST', '/users', () => ok(json({ ok: true })), { body: Body })] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 123 })
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Request body failed contract validation', boundary: 'body', issues: [{ message: 'SigilJS contract rejected value' }] } });
  });

  test('failed SigilJS response contract returns deterministic 500', async () => {
    const ResponseContract = sigil({ id: String });
    const app = createApp({ routes: [route('GET', '/users/1', () => ok(json({ id: 1 })), { response: ResponseContract })] });

    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_RESPONSE_CONTRACT_FAILED', message: 'Response failed contract validation', boundary: 'response', issues: [{ message: 'SigilJS contract rejected value' }] } });
  });

  test('generic contract compatibility remains after SigilJS integration', async () => {
    const app = createApp({ routes: [route('GET', '/search', (ctx) => ok(json(ctx.query)), { query: (query) => ({ q: query.q.toUpperCase() }) })] });

    const response = await app.fetch(new Request('http://local.test/search?q=sigil'));

    expect(await response.json()).toEqual({ q: 'SIGIL' });
  });
});
