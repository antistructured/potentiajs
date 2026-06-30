import { describe, expect, test } from 'bun:test';

import { scanRouteTree } from '../src/dev/file-routing/index.js';

const rootDir = new URL('./fixtures/file-routing-basic/routes/', import.meta.url).pathname;

describe('file routing scanner', () => {
  test('discovers route files and scope metadata deterministically without importing modules', () => {
    const result = scanRouteTree(rootDir);

    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.routes.map((route) => route.routePath)).toEqual([
      '/',
      '/health',
      '/users',
      '/users/:id'
    ]);
    expect(result.scopes.map((scope) => scope.routePath)).toEqual(['/users']);
    expect(result.ignored.map((entry) => entry.reason).sort()).toEqual([
      'private-file',
      'private-folder',
      'unsupported-extension'
    ]);
  });

  test('route entries include stable import paths and segments', () => {
    const result = scanRouteTree(rootDir);
    const dynamic = result.routes.find((route) => route.routePath === '/users/:id');

    expect(dynamic).toMatchObject({
      kind: 'route',
      routePath: '/users/:id',
      importPath: './users/[id].js',
      segments: ['users', ':id']
    });
  });

  test('scope entries include directory and import paths', () => {
    const result = scanRouteTree(rootDir);

    expect(result.scopes[0]).toMatchObject({
      kind: 'scope',
      routePath: '/users',
      importPath: './users/_routes.js',
      segments: ['users']
    });
  });

  test('missing directory fails deterministically', () => {
    const result = scanRouteTree(`${rootDir}/missing`);

    expect(result).toMatchObject({
      ok: false,
      routes: [],
      scopes: [],
      ignored: [],
      errors: [{ code: 'POTENTIA_FILE_ROUTE_MISSING_ROOT' }]
    });
  });
});
