import { describe, expect, test } from 'bun:test';

import { mapRouteFile } from '../src/dev/file-routing/index.js';

describe('file routing path mapping', () => {
  test('root index maps to /', () => {
    expect(mapRouteFile('/project/routes/index.js', '/project/routes')).toEqual({
      ok: true,
      filePath: '/project/routes/index.js',
      relativePath: 'index.js',
      routePath: '/',
      kind: 'route',
      ignored: false,
      reason: null,
      error: null,
      segments: []
    });
  });

  test('nested index maps to folder path', () => {
    expect(mapRouteFile('/project/routes/users/index.js', '/project/routes').routePath).toBe('/users');
  });

  test('dynamic param maps to colon param', () => {
    expect(mapRouteFile('/project/routes/users/[id].js', '/project/routes').routePath).toBe('/users/:id');
  });

  test('nested dynamic param maps deterministically', () => {
    expect(mapRouteFile('/project/routes/api/users/[id].js', '/project/routes').routePath).toBe('/api/users/:id');
  });

  test('private file is ignored', () => {
    expect(mapRouteFile('/project/routes/users/_private.js', '/project/routes')).toMatchObject({
      ok: true,
      kind: 'ignored',
      ignored: true,
      reason: 'private-file'
    });
  });

  test('private folder is ignored', () => {
    expect(mapRouteFile('/project/routes/_drafts/index.js', '/project/routes')).toMatchObject({
      ok: true,
      kind: 'ignored',
      ignored: true,
      reason: 'private-folder'
    });
  });

  test('non-JS files are ignored deterministically', () => {
    expect(mapRouteFile('/project/routes/users/readme.md', '/project/routes')).toMatchObject({
      ok: true,
      kind: 'ignored',
      ignored: true,
      reason: 'unsupported-extension'
    });
  });

  test('catch-all syntax fails deterministically', () => {
    expect(mapRouteFile('/project/routes/users/[...rest].js', '/project/routes')).toMatchObject({
      ok: false,
      kind: 'invalid',
      error: { code: 'POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL' }
    });
  });

  test('route group syntax fails deterministically', () => {
    expect(mapRouteFile('/project/routes/(admin)/users.js', '/project/routes')).toMatchObject({
      ok: false,
      kind: 'invalid',
      error: { code: 'POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP' }
    });
  });

  test('duplicate slashes are normalized', () => {
    expect(mapRouteFile('/project/routes//users//[id].js', '/project/routes').routePath).toBe('/users/:id');
  });
});
