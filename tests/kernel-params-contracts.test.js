import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel params contracts', () => {
  test('params contract transforms params', async () => {
    const app = createApp({
      routes: [route('GET', '/users/:id', (ctx) => ok(json(ctx.params)), {
        params: (params) => ({ id: Number(params.id) })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/42'));

    expect(await response.json()).toMatchObject({ id: 42 });
  });

  test('params contract validates params', async () => {
    const app = createApp({
      routes: [route('GET', '/users/:id', (ctx) => ok(json(ctx.params)), {
        params: { check: (params) => /^\d+$/.test(params.id) }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/42'));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: '42' });
  });

  test('failed params contract returns 400', async () => {
    const app = createApp({
      routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), {
        params: { check: (params) => /^\d+$/.test(params.id) }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/abc'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Params failed contract validation', boundary: 'params', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('handler receives validated ctx.params', async () => {
    const app = createApp({
      routes: [route('GET', '/orgs/:orgId/users/:userId', (ctx) => ok(json({ params: ctx.params })), {
        params: { parse: (params) => ({ orgId: params.orgId.toUpperCase(), userId: Number(params.userId) }) }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/orgs/acme/users/7'));

    expect(await response.json()).toMatchObject({ params: { orgId: 'ACME', userId: 7 } });
  });

  test('params contract runs before handler', async () => {
    let handlerRan = false;
    const app = createApp({
      routes: [route('GET', '/users/:id', () => {
        handlerRan = true;
        return ok(json({ ok: true }));
      }, {
        params: { check: () => false }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/abc'));

    expect(response.status).toBe(400);
    expect(handlerRan).toBe(false);
  });

  test('bad URI encoding still returns bad request', async () => {
    const app = createApp({
      routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), {
        params: { check: () => true }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/%E0%A4%A'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Invalid route parameter encoding' } });
  });

  test('query/header/body contracts still pass with params contract', async () => {
    const app = createApp({
      routes: [route('POST', '/users/:id', (ctx) => ok(json({
        params: ctx.params,
        query: ctx.query,
        headers: { mode: ctx.headers['x-mode'] },
        body: ctx.body
      })), {
        params: (params) => ({ id: Number(params.id) }),
        query: (query) => ({ page: Number(query.page) }),
        headers: { check: (headers) => headers['x-mode'] === 'test' },
        body: (body) => ({ name: body.name.trim() })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/3?page=2', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-mode': 'test' },
      body: JSON.stringify({ name: ' Ada ' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      params: { id: 3 },
      query: { page: 2 },
      headers: { mode: 'test' },
      body: { name: 'Ada' }
    });
  });
});
