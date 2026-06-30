import { describe, expect, test } from 'bun:test';

import { createApp, createRoutes, json, ok, route } from '../src/index.js';

describe('kernel route collections', () => {
  test('createRoutes creates stable shape', () => {
    const collection = createRoutes();

    expect(collection).toEqual({
      kind: 'routes',
      prefix: '',
      routes: [],
      hooks: { beforeRequest: [], afterResponse: [], onError: [] },
      contracts: {},
      meta: null
    });
  });

  test('empty collection works in app routes', async () => {
    const app = createApp({ routes: [createRoutes()] });
    const response = await app.fetch(new Request('http://local.test/missing'));

    expect(response.status).toBe(404);
  });

  test('collection with direct route works', async () => {
    const collection = createRoutes({
      routes: [route('GET', '/inside', () => ok(json({ ok: true })))]
    });
    const app = createApp({ routes: [collection] });

    const response = await app.fetch(new Request('http://local.test/inside'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('mixed direct routes and collections work', async () => {
    const collection = createRoutes({
      routes: [route('GET', '/inside', () => ok(json({ source: 'collection' })))]
    });
    const app = createApp({
      routes: [
        route('GET', '/', () => ok(json({ source: 'direct' }))),
        collection
      ]
    });

    const root = await app.fetch(new Request('http://local.test/'));
    const inside = await app.fetch(new Request('http://local.test/inside'));

    expect(await root.json()).toEqual({ source: 'direct' });
    expect(await inside.json()).toEqual({ source: 'collection' });
  });

  test('collection does not mutate original route array', () => {
    const routes = [route('GET', '/inside', () => ok(json({ ok: true })))];
    const collection = createRoutes({ routes: routes });

    collection.routes.push(route('GET', '/extra', () => ok(json({ ok: true }))));

    expect(routes).toHaveLength(1);
  });
});
