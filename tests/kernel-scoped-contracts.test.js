import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, createRoutes, json, mount, ok, route } from '../src/index.js';

describe('kernel scoped contract defaults', () => {
  test('collection headers contract applies', async () => {
    const headers = {
      parse(value) {
        if (value['x-auth'] !== 'yes') throw new Error('missing auth');
        return value;
      }
    };
    const routes = createRoutes({
      contracts: { headers: headers },
      routes: [route('GET', '/secure', () => ok(json({ ok: true })))]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/secure'));

    expect(response.status).toBe(400);
    expect((await response.json()).error.boundary).toBe('headers');
  });

  test('collection query contract applies', async () => {
    const routes = createRoutes({
      contracts: { query: (query) => ({ page: Number(query.page || 1) }) },
      routes: [route('GET', '/items', (ctx) => ok(json({ page: ctx.query.page })))]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items?page=2'));

    expect(await response.json()).toEqual({ page: 2 });
  });

  test('route-level contract overrides scoped contract', async () => {
    const routes = createRoutes({
      contracts: { query: () => ({ source: 'collection' }) },
      routes: [route('GET', '/items', (ctx) => ok(json(ctx.query)), {
        query: () => ({ source: 'route' })
      })]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items'));

    expect(await response.json()).toEqual({ source: 'route' });
  });

  test('different contract boundaries merge', async () => {
    const routes = createRoutes({
      contracts: { headers: (headers) => ({ auth: headers['x-auth'] }) },
      routes: [route('GET', '/items', (ctx) => ok(json({ auth: ctx.headers.auth, page: ctx.query.page })), {
        query: (query) => ({ page: Number(query.page) })
      })]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items?page=3', { headers: { 'x-auth': 'yes' } }));

    expect(await response.json()).toEqual({ auth: 'yes', page: 3 });
  });

  test('nested and mounted contract defaults compose', async () => {
    const inner = createRoutes({
      prefix: '/items',
      contracts: { query: (query) => ({ page: Number(query.page) }) },
      routes: [route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id, page: ctx.query.page, auth: ctx.headers.auth })))]
    });
    const outer = createRoutes({
      prefix: '/v1',
      contracts: { headers: (headers) => ({ auth: headers['x-auth'] }) },
      routes: [inner]
    });
    const app = createApp({ routes: [mount(outer, { prefix: '/api' })] });

    const response = await app.fetch(new Request('http://local.test/api/v1/items/7?page=4', { headers: { 'x-auth': 'yes' } }));

    expect(await response.json()).toEqual({ id: '7', page: 4, auth: 'yes' });
  });

  test('SigilJS scoped contract works', async () => {
    const routes = createRoutes({
      contracts: { params: sigil({ id: String }) },
      routes: [route('GET', '/items/:id', (ctx) => ok(json({ id: ctx.params.id })))]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items/abc'));

    expect(await response.json()).toEqual({ id: 'abc' });
  });

  test('generic scoped contract works', async () => {
    const routes = createRoutes({
      contracts: { params: (params) => ({ id: Number(params.id) }) },
      routes: [route('GET', '/items/:id', (ctx) => ok(json({ id: ctx.params.id })))]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items/8'));

    expect(await response.json()).toEqual({ id: 8 });
  });

  test('original route options are not mutated', () => {
    const options = { query: (query) => query };
    const item = route('GET', '/items', () => ok(json({ ok: true })), options);
    const routes = createRoutes({ contracts: { headers: (headers) => headers }, routes: [item] });

    createApp({ routes: [routes] });

    expect(Object.keys(options)).toEqual(['query']);
    expect(item.options).toBe(options);
  });
});
