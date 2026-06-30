import { describe, expect, test } from 'bun:test';

import { projectRoutes } from '../src/index.js';
import { app } from '../examples/composed-basic/index.js';

describe('projection metadata example', () => {
  test('projection metadata can list route paths and methods', () => {
    const projection = projectRoutes(app);

    expect(projection.routes.map((route) => `${route.method} ${route.path}`)).toEqual([
      'GET /',
      'GET /api/users',
      'GET /api/users/:id',
      'POST /api/users',
      'GET /health'
    ]);
  });

  test('projection metadata shows contract boundaries', () => {
    const projection = projectRoutes(app);
    const userRoute = projection.routes.find((route) => route.path === '/api/users/:id');

    expect(Object.keys(userRoute.contracts)).toEqual(['params', 'query', 'headers', 'body', 'response']);
    expect(userRoute.contracts.params.kind).toBe('sigil');
    expect(userRoute.contracts.query.kind).toBe('sigil');
    expect(userRoute.contracts.headers.kind).toBe('sigil');
    expect(userRoute.contracts.body).toBe(null);
    expect(userRoute.contracts.response.kind).toBe('sigil');
  });

  test('projection metadata exposes safe SigilJS field info', () => {
    const projection = projectRoutes(app);
    const userRoute = projection.routes.find((route) => route.path === '/api/users/:id');

    expect(userRoute.contracts.params.fields).toEqual([{ name: 'id', required: true, kind: 'string', fields: null }]);
    expect(userRoute.contracts.query.fields).toEqual([{ name: 'include', required: false, kind: 'string', fields: null }]);
    expect(userRoute.contracts.response.fields).toEqual([
      { name: 'id', required: true, kind: 'string', fields: null },
      { name: 'name', required: true, kind: 'string', fields: null }
    ]);
  });

  test('projection metadata includes scoped defaults and hook counts', () => {
    const projection = projectRoutes(app);
    const userRoute = projection.routes.find((route) => route.path === '/api/users/:id');

    expect(userRoute.contracts.headers.fields).toEqual([{ name: 'x-auth', required: true, kind: 'string', fields: null }]);
    expect(userRoute.hooks).toEqual({ beforeRequest: 1, afterResponse: 1, onError: 0 });
  });

  test('projection metadata remains deterministic', () => {
    expect(projectRoutes(app)).toEqual(projectRoutes(app));
  });
});
