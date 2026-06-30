import { describe, expect, test } from 'bun:test';

import { createRouteManifest, route } from '../src/index.js';

describe('kernel route manifest diagnostics and lookups', () => {
  test('duplicate route ID diagnostic is deterministic', () => {
    const manifest = createRouteManifest([
      route('GET', '/users/:id', () => 'one'),
      route('GET', '/users/:id', () => 'two')
    ]);

    expect(manifest.diagnostics).toEqual([
      {
        code: 'POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID',
        message: 'Duplicate route id: GET /users/:id',
        detail: { index: 1, routeId: 'GET /users/:id', routeName: null }
      },
      {
        code: 'POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID',
        message: 'Duplicate route method/path: GET /users/:id',
        detail: { index: 1, routeId: 'GET /users/:id', routeName: null }
      }
    ]);
  });

  test('duplicate route name diagnostic is deterministic', () => {
    const manifest = createRouteManifest([
      route('GET', '/users/:id', () => 'one', { name: 'users.show' }),
      route('GET', '/members/:id', () => 'two', { name: 'users.show' })
    ]);

    expect(manifest.diagnostics).toEqual([
      {
        code: 'POTENTIA_MANIFEST_DUPLICATE_ROUTE_NAME',
        message: 'Duplicate route name: users.show',
        detail: { index: 1, routeId: 'GET /members/:id', routeName: 'users.show' }
      }
    ]);
  });

  test('duplicate method/path creates duplicate ID diagnostic', () => {
    const manifest = createRouteManifest([
      route('post', '//users/', () => 'one'),
      route('POST', '/users', () => 'two')
    ]);

    expect(manifest.routes.map((item) => item.id)).toEqual(['POST /users', 'POST /users']);
    expect(manifest.diagnostics.map((item) => item.code)).toEqual([
      'POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID',
      'POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID'
    ]);
  });

  test('lookups by ID reference route index', () => {
    const manifest = createRouteManifest([
      route('GET', '/', () => 'root'),
      route('GET', '/users/:id', () => 'show')
    ]);

    expect(manifest.lookups.byId).toEqual({
      'GET /': 0,
      'GET /users/:id': 1
    });
  });

  test('lookups by name reference route ID', () => {
    const manifest = createRouteManifest([
      route('GET', '/users/:id', () => 'show', { name: 'users.show' })
    ]);

    expect(manifest.lookups.byName).toEqual({ 'users.show': 'GET /users/:id' });
  });

  test('lookups by method/path reference route ID', () => {
    const manifest = createRouteManifest([
      route('GET', '/users/:id', () => 'show')
    ]);

    expect(manifest.lookups.byMethodPath).toEqual({ 'GET /users/:id': 'GET /users/:id' });
  });

  test('duplicate lookup behavior keeps first route deterministically', () => {
    const manifest = createRouteManifest([
      route('GET', '/users/:id', () => 'one', { name: 'users.show' }),
      route('GET', '/users/:id', () => 'two', { name: 'users.show' })
    ]);

    expect(manifest.lookups.byId).toEqual({ 'GET /users/:id': 0 });
    expect(manifest.lookups.byName).toEqual({ 'users.show': 'GET /users/:id' });
    expect(manifest.lookups.byMethodPath).toEqual({ 'GET /users/:id': 'GET /users/:id' });
  });

  test('diagnostics are stable', () => {
    const entries = [
      route('GET', '/users/:id', () => 'one', { name: 'users.show' }),
      route('GET', '/users/:id', () => 'two', { name: 'users.show' })
    ];

    expect(createRouteManifest(entries).diagnostics).toEqual(createRouteManifest(entries).diagnostics);
  });
});
