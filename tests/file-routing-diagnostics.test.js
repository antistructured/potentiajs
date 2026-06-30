import { describe, expect, test } from 'bun:test';

import { scanRouteTree } from '../src/dev/file-routing/index.js';

const rootDir = new URL('./fixtures/file-routing-collisions/routes/', import.meta.url).pathname;

describe('file routing diagnostics', () => {
  test('scanner reports collisions and unsupported conventions with stable codes', () => {
    const result = scanRouteTree(rootDir);
    const codes = result.errors.map((error) => error.code).sort();

    expect(result.ok).toBe(false);
    expect(codes).toEqual([
      'POTENTIA_FILE_ROUTE_COLLISION',
      'POTENTIA_FILE_ROUTE_INVALID_PARAM',
      'POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL',
      'POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP',
      'POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM'
    ]);
  });

  test('collision diagnostics include route path and source files', () => {
    const result = scanRouteTree(rootDir);
    const collision = result.errors.find((error) => error.code === 'POTENTIA_FILE_ROUTE_COLLISION');

    expect(collision.routePath).toBe('/users');
    expect(collision.files.map((file) => file.endsWith('/users.js') || file.endsWith('/users/index.js'))).toEqual([true, true]);
  });

  test('unsupported diagnostics include file paths', () => {
    const result = scanRouteTree(rootDir);
    const unsupported = result.errors.find((error) => error.code === 'POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL');

    expect(unsupported.filePath.endsWith('/blog/[...rest].js')).toBe(true);
    expect(unsupported.message).toBe('Catch-all route params are deferred');
  });
});
