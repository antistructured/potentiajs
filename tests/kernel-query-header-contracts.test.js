import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel query and header contracts', () => {
  test('query contract transforms query', async () => {
    const app = createApp({
      routes: [route('GET', '/search', (ctx) => ok(json(ctx.query)), {
        query: (query) => ({ term: query.q.toUpperCase() })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/search?q=potentia'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ term: 'POTENTIA' });
  });

  test('query contract receives deterministic plain object', async () => {
    let seenQuery = null;
    const app = createApp({
      routes: [route('GET', '/search', () => ok(json({ ok: true })), {
        query: (query) => {
          seenQuery = query;
          return query;
        }
      })]
    });

    await app.fetch(new Request('http://local.test/search?b=2&a=1'));

    expect(Object.keys(seenQuery)).toEqual(['a', 'b']);
    expect(seenQuery).toEqual({ a: '1', b: '2' });
  });

  test('repeated query params become arrays deterministically', async () => {
    const app = createApp({
      routes: [route('GET', '/search', (ctx) => ok(json(ctx.query)), {
        query: (query) => query
      })]
    });

    const response = await app.fetch(new Request('http://local.test/search?tag=a&tag=b&tag=c'));

    expect(await response.json()).toEqual({ tag: ['a', 'b', 'c'] });
  });

  test('failed query contract returns 400', async () => {
    const app = createApp({
      routes: [route('GET', '/search', () => ok(json({ ok: true })), {
        query: { check: (query) => query.q === 'yes' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/search?q=no'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Query failed contract validation', boundary: 'query', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('header contract transforms lowercase headers', async () => {
    const app = createApp({
      routes: [route('GET', '/headers', (ctx) => ok(json({ auth: ctx.headers.authorization })), {
        headers: (headers) => ({ authorization: headers.authorization.replace('Token ', '') })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/headers', {
      headers: { Authorization: 'Token abc' }
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ auth: 'abc' });
  });

  test('header names are lowercase before contract', async () => {
    let seenHeaders = null;
    const app = createApp({
      routes: [route('GET', '/headers', () => ok(json({ ok: true })), {
        headers: (headers) => {
          seenHeaders = headers;
          return headers;
        }
      })]
    });

    await app.fetch(new Request('http://local.test/headers', { headers: { 'X-Test': 'yes' } }));

    expect(seenHeaders['x-test']).toBe('yes');
    expect(seenHeaders['X-Test']).toBeUndefined();
  });

  test('failed header contract returns 400', async () => {
    const app = createApp({
      routes: [route('GET', '/headers', () => ok(json({ ok: true })), {
        headers: { check: (headers) => headers['x-required'] === 'yes' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/headers'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Headers failed contract validation', boundary: 'headers', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('body contract still works with query and headers', async () => {
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => ok(json({ query: ctx.query, header: ctx.headers['x-mode'], body: ctx.body })), {
        query: (query) => query,
        headers: (headers) => headers,
        body: (body) => ({ name: body.name.toUpperCase() })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users?debug=true', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-mode': 'test' },
      body: JSON.stringify({ name: 'daniel' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      query: { debug: 'true' },
      header: 'test',
      body: { name: 'DANIEL' }
    });
  });
});
