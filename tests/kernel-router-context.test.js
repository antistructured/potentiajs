import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';
import { createRequestContext } from '../src/kernel/context.js';

describe('kernel router and request context', () => {
  test('app exposes fetch', () => {
    const app = createApp({ routes: [] });

    expect(typeof app.fetch).toBe('function');
  });

  test('static GET route matches', async () => {
    const app = createApp({
      routes: [route('GET', '/', () => ok(json({ message: 'hello' })))]
    });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'hello' });
  });

  test('wrong path returns deterministic 404', async () => {
    const app = createApp({ routes: [route('GET', '/', () => 'home')] });

    const response = await app.fetch(new Request('http://local.test/missing'));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_NOT_FOUND', message: 'No route matched the request path' } });
  });

  test('wrong method returns deterministic 405 when path exists', async () => {
    const app = createApp({ routes: [route('GET', '/', () => 'home')] });

    const response = await app.fetch(new Request('http://local.test/', { method: 'POST' }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_METHOD_NOT_ALLOWED', message: 'Route matched the path, but not the request method' } });
  });

  test('route handler receives context', async () => {
    let seenContext = null;
    const app = createApp({
      state: { value: 1 },
      routes: [route('GET', '/ctx', (ctx) => {
        seenContext = ctx;
        return ok(json({ path: ctx.path, query: ctx.query.name, state: ctx.state.value }));
      })]
    });

    const response = await app.fetch(new Request('http://local.test/ctx?name=potentia'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ path: '/ctx', query: 'potentia', state: 1 });
    expect(seenContext.request).toBeInstanceOf(Request);
  });

  test('context has stable expected keys', () => {
    const request = new Request('http://local.test/items?filter=open');
    const matchedRoute = route('GET', '/items', () => 'items');
    const ctx = createRequestContext(request, { route: matchedRoute, params: {} }, { state: true });

    expect(Object.keys(ctx)).toEqual(['request', 'method', 'url', 'path', 'params', 'query', 'headers', 'body', 'route', 'state']);
    expect(ctx.method).toBe('GET');
    expect(ctx.path).toBe('/items');
    expect(ctx.params).toEqual({});
    expect(ctx.query.filter).toBe('open');
    expect(ctx.body).toBe(null);
  });

  test('route handler return values are converted to native Response', async () => {
    const app = createApp({ routes: [route('GET', '/value', () => ({ value: 1 }))] });

    const response = await app.fetch(new Request('http://local.test/value'));

    expect(response).toBeInstanceOf(Response);
    expect(await response.json()).toEqual({ value: 1 });
  });
});
