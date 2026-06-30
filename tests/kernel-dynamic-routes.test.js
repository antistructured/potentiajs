import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel dynamic route params', () => {
  test('static route still matches', async () => {
    const app = createApp({ routes: [route('GET', '/status', () => ok(json({ status: 'ok' })))] });

    const response = await app.fetch(new Request('http://local.test/status'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: 'ok' });
  });

  test('single param route matches and params are strings', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', (ctx) => ok(json(ctx.params)))] });

    const response = await app.fetch(new Request('http://local.test/users/123'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: '123' });
  });

  test('multiple params route matches', async () => {
    const app = createApp({ routes: [route('GET', '/orgs/:orgId/users/:userId', (ctx) => ok(json(ctx.params)))] });

    const response = await app.fetch(new Request('http://local.test/orgs/acme/users/42'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ orgId: 'acme', userId: '42' });
  });

  test('params are URL-decoded deterministically', async () => {
    const app = createApp({ routes: [route('GET', '/files/:name', (ctx) => ok(json(ctx.params)))] });

    const response = await app.fetch(new Request('http://local.test/files/hello%20world'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'hello world' });
  });

  test('static route beats dynamic route', async () => {
    const app = createApp({
      routes: [
        route('GET', '/users/:id', () => ok(json({ route: 'dynamic' }))),
        route('GET', '/users/me', () => ok(json({ route: 'static' })))
      ]
    });

    const response = await app.fetch(new Request('http://local.test/users/me'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ route: 'static' });
  });

  test('wrong segment count returns 404', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ matched: true })))] });

    const missing = await app.fetch(new Request('http://local.test/users'));
    const extra = await app.fetch(new Request('http://local.test/users/123/profile'));

    expect(missing.status).toBe(404);
    expect(extra.status).toBe(404);
  });

  test('wrong method returns 405 where path pattern exists', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ matched: true })))] });

    const response = await app.fetch(new Request('http://local.test/users/123', { method: 'POST' }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
  });

  test('invalid encoded param fails deterministically', async () => {
    const app = createApp({ routes: [route('GET', '/files/:name', () => ok(json({ matched: true })))] });

    const response = await app.fetch(new Request('http://local.test/files/%E0%A4%A'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Invalid route parameter encoding' } });
  });
});
