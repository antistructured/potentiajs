import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, createRouteManifest, createRoutes, mount, route } from '../src/index.js';

describe('kernel route manifest', () => {
  test('creates manifest from route array', () => {
    const manifest = createRouteManifest([
      route('GET', '/', () => 'ok'),
      route('POST', '/users', () => 'ok')
    ], { packageName: '@potentiajs/core', packageVersion: '0.1.0-preview.0' });

    expect(manifest.kind).toBe('potentia-route-manifest');
    expect(manifest.version).toBe(1);
    expect(manifest.package).toEqual({ name: '@potentiajs/core', version: '0.1.0-preview.0' });
    expect(manifest.routes.map((item) => item.id)).toEqual(['GET /', 'POST /users']);
  });

  test('creates manifest from route collection', () => {
    const collection = createRoutes({
      prefix: '/users',
      routes: [route('GET', '/:id', () => 'ok')]
    });

    const manifest = createRouteManifest(collection);

    expect(manifest.routes.map((item) => item.path)).toEqual(['/users/:id']);
    expect(manifest.routes.map((item) => item.id)).toEqual(['GET /users/:id']);
  });

  test('creates manifest from app object', () => {
    const app = createApp({ routes: [route('GET', '/', () => 'ok')] });
    const manifest = createRouteManifest(app);

    expect(manifest.routes.map((item) => item.id)).toEqual(['GET /']);
  });

  test('manifest includes route IDs and names', () => {
    const manifest = createRouteManifest([route('GET', '/users/:id', () => 'ok', { name: 'users.show' })]);

    expect(manifest.routes[0].id).toBe('GET /users/:id');
    expect(manifest.routes[0].name).toBe('users.show');
  });

  test('manifest includes contract projections', () => {
    const Response = sigil({ id: String, name: String });
    const manifest = createRouteManifest([route('GET', '/users/:id', () => 'ok', { response: Response })]);

    expect(manifest.routes[0].contracts.response.kind).toBe('sigil');
    expect(manifest.routes[0].contracts.response.fields).toEqual([
      { name: 'id', required: true, kind: 'string', fields: null },
      { name: 'name', required: true, kind: 'string', fields: null }
    ]);
  });

  test('manifest includes hook counts from scoped composition', () => {
    const collection = createRoutes({
      hooks: { beforeRequest: [() => 'hook'], afterResponse: [() => 'hook'] },
      routes: [route('GET', '/', () => 'ok')]
    });

    const manifest = createRouteManifest(collection);

    expect(manifest.routes[0].hooks).toEqual({ beforeRequest: 1, afterResponse: 1, onError: 0 });
  });

  test('manifest includes source and meta', () => {
    const manifest = createRouteManifest([route('GET', '/users/:id', () => 'ok', {
      name: 'users.show',
      source: { file: 'routes/users/[id].js' },
      meta: { description: 'Fetch user' }
    })]);

    expect(manifest.routes[0].source).toEqual({ file: 'routes/users/[id].js', line: null, column: null });
    expect(manifest.routes[0].meta).toEqual({ description: 'Fetch user' });
  });

  test('manifest supports mounted/composed routes', () => {
    const users = createRoutes({ prefix: '/users', routes: [route('GET', '/:id', () => 'ok')] });
    const manifest = createRouteManifest([mount(users, { prefix: '/api' })]);

    expect(manifest.routes.map((item) => item.id)).toEqual(['GET /api/users/:id']);
  });

  test('manifest does not execute handlers, hooks, or contracts', () => {
    let ran = false;
    const contract = { parse(value) { ran = true; return value; } };
    const collection = createRoutes({
      hooks: { beforeRequest: [() => { ran = true; }] },
      routes: [route('GET', '/', () => { ran = true; return 'ok'; }, { query: contract })]
    });

    const manifest = createRouteManifest(collection);

    expect(ran).toBe(false);
    expect(manifest.routes[0].contracts.query.kind).toBe('parse');
  });

  test('manifest output is deterministic', () => {
    const entries = [route('GET', '/b', () => 'b'), route('GET', '/a', () => 'a')];

    expect(createRouteManifest(entries)).toEqual(createRouteManifest(entries));
  });

  test('invalid input returns deterministic diagnostic', () => {
    const manifest = createRouteManifest({ nope: true });

    expect(manifest.routes).toEqual([]);
    expect(manifest.diagnostics).toEqual([{ code: 'POTENTIA_MANIFEST_INVALID_ROUTE', message: 'Manifest input could not be projected as routes', detail: { index: null, routeId: null, routeName: null } }]);
  });
});
