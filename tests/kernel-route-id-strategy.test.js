import { describe, expect, test } from 'bun:test';

import { projectRoute, route } from '../src/index.js';
import { createRouteId, normalizeRoutePath } from '../src/kernel/route-manifest.js';

describe('kernel route id strategy', () => {
  test('root route ID is deterministic', () => {
    expect(createRouteId(route('GET', '/', () => 'ok'))).toBe('GET /');
  });

  test('dynamic route ID uses method and normalized path', () => {
    expect(createRouteId(route('GET', '/users/:id', () => 'ok'))).toBe('GET /users/:id');
  });

  test('method normalization uppercases IDs', () => {
    expect(createRouteId(route('post', '/users', () => 'ok'))).toBe('POST /users');
  });

  test('path normalization removes duplicate slashes and trailing slash', () => {
    expect(normalizeRoutePath('//users/:id/')).toBe('/users/:id');
    expect(createRouteId({ method: 'GET', path: '//users/:id/' })).toBe('GET /users/:id');
  });

  test('optional name projects when present', () => {
    const projection = projectRoute(route('GET', '/users/:id', () => 'ok', { name: 'users.show' }));

    expect(projection.id).toBe('GET /users/:id');
    expect(projection.name).toBe('users.show');
  });

  test('route ID output is deterministic', () => {
    const value = route('GET', '/users/:id', () => 'ok');

    expect(createRouteId(value)).toBe(createRouteId(value));
    expect(projectRoute(value).id).toBe(projectRoute(value).id);
  });

  test('invalid route input returns deterministic null ID', () => {
    expect(createRouteId({ nope: true })).toBe(null);
    expect(projectRoute({ nope: true }).id).toBe(null);
  });
});
