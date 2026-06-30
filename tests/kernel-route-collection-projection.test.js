import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, createRoutes, mount, projectRoutes, route } from '../src/index.js';

describe('kernel route collection projection', () => {
  test('collection projection summarizes routes, hooks, contracts, and prefix', () => {
    const Params = sigil({ id: String });
    const collection = createRoutes({
      prefix: '/users',
      contracts: { params: Params },
      hooks: { beforeRequest: [() => 'hook'] },
      meta: { feature: 'users' },
      routes: [route('GET', '/:id', () => 'ok')]
    });

    const projection = projectRoutes(collection);

    expect(projection.kind).toBe('routes');
    expect(projection.prefix).toBe('/users');
    expect(projection.routes.map((item) => item.path)).toEqual(['/users/:id']);
    expect(projection.hooks).toEqual({ beforeRequest: 1, afterResponse: 0, onError: 0 });
    expect(projection.contracts.params.kind).toBe('sigil');
    expect(projection.meta).toEqual({ feature: 'users' });
  });

  test('direct route array projection is supported', () => {
    const projection = projectRoutes([
      route('GET', '/', () => 'root'),
      route('POST', '/users', () => 'create')
    ]);

    expect(projection.prefix).toBe(null);
    expect(projection.routes.map((item) => `${item.method} ${item.path}`)).toEqual(['GET /', 'POST /users']);
  });

  test('scoped contracts project onto flattened child routes', () => {
    const Query = sigil({ q: String });
    const collection = createRoutes({
      contracts: { query: Query },
      routes: [route('GET', '/search', () => 'ok')]
    });

    const projection = projectRoutes(collection);

    expect(projection.contracts.query.kind).toBe('sigil');
    expect(projection.routes[0].contracts.query.kind).toBe('sigil');
    expect(projection.routes[0].contracts.query.fields).toEqual([{ name: 'q', required: true, kind: 'string', fields: null }]);
  });

  test('mounted route projection preserves effective paths', () => {
    const collection = createRoutes({
      prefix: '/users',
      routes: [route('GET', '/:id', () => 'ok')]
    });
    const projection = projectRoutes(mount(collection, { prefix: '/api' }));

    expect(projection.prefix).toBe('/api');
    expect(projection.routes.map((item) => item.path)).toEqual(['/api/users/:id']);
  });

  test('app projection accepts composed app routes', () => {
    const app = createApp({
      hooks: { afterResponse: [() => 'hook'] },
      routes: [route('GET', '/', () => 'ok')]
    });

    const projection = projectRoutes(app);

    expect(projection.routes.map((item) => item.path)).toEqual(['/']);
    expect(projection.hooks).toEqual({ beforeRequest: 0, afterResponse: 1, onError: 0 });
  });

  test('hooks and handlers are not executed', () => {
    let ran = false;
    const collection = createRoutes({
      hooks: { beforeRequest: [() => { ran = true; }] },
      routes: [route('GET', '/', () => { ran = true; return 'ok'; })]
    });

    const projection = projectRoutes(collection);

    expect(ran).toBe(false);
    expect(projection.hooks.beforeRequest).toBe(1);
    expect(projection.routes[0].path).toBe('/');
  });

  test('invalid route collection input projects deterministically', () => {
    expect(projectRoutes({ nope: true })).toEqual({
      kind: 'unknown-routes',
      prefix: null,
      routes: [],
      hooks: { beforeRequest: 0, afterResponse: 0, onError: 0 },
      contracts: { params: null, query: null, headers: null, body: null, response: null },
      meta: null
    });
  });

  test('projection output order is deterministic', () => {
    const entries = [route('GET', '/b', () => 'b'), route('GET', '/a', () => 'a')];

    expect(projectRoutes(entries)).toEqual(projectRoutes(entries));
    expect(projectRoutes(entries).routes.map((item) => item.path)).toEqual(['/b', '/a']);
  });
});
