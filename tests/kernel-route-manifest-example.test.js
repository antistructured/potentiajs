import { describe, expect, test } from 'bun:test';

import { createRouteManifest } from '../src/index.js';
import { app } from '../examples/composed-basic/index.js';

describe('route manifest metadata example', () => {
  test('manifest can list named routes', () => {
    const manifest = createRouteManifest(app);

    expect(manifest.routes.filter((route) => route.name).map((route) => route.name)).toEqual([
      'users.index',
      'users.show',
      'users.create'
    ]);
  });

  test('manifest exposes route descriptions', () => {
    const manifest = createRouteManifest(app);
    const route = manifest.routes.find((item) => item.name === 'users.show');

    expect(route.meta).toEqual({ description: 'Fetch a user by id' });
    expect(route.source).toEqual({ file: 'examples/composed-basic/index.js', line: null, column: null });
  });

  test('manifest exposes safe contract summaries', () => {
    const manifest = createRouteManifest(app);
    const route = manifest.routes.find((item) => item.name === 'users.show');

    expect(route.contracts.params.fields).toEqual([{ name: 'id', required: true, kind: 'string', fields: null }]);
    expect(route.contracts.response.fields).toEqual([
      { name: 'id', required: true, kind: 'string', fields: null },
      { name: 'name', required: true, kind: 'string', fields: null }
    ]);
  });

  test('manifest lookup by name works', () => {
    const manifest = createRouteManifest(app);

    expect(manifest.lookups.byName['users.show']).toBe('GET /api/users/:id');
    expect(manifest.routes[manifest.lookups.byId[manifest.lookups.byName['users.show']]].name).toBe('users.show');
  });

  test('manifest metadata is deterministic', () => {
    expect(createRouteManifest(app)).toEqual(createRouteManifest(app));
  });
});
