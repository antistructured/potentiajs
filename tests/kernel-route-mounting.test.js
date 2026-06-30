import { describe, expect, test } from 'bun:test';

import { createApp, createRoutes, json, mount, ok, route } from '../src/index.js';

describe('kernel route mounting', () => {
  test('collection prefix applies', async () => {
    const users = createRoutes({
      prefix: '/users',
      routes: [route('GET', '/', () => ok(json({ route: 'index' })))]
    });
    const app = createApp({ routes: [users] });

    const response = await app.fetch(new Request('http://local.test/users'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ route: 'index' });
  });

  test('mount prefix applies', async () => {
    const users = createRoutes({ routes: [route('GET', '/users', () => ok(json({ ok: true })))] });
    const app = createApp({ routes: [mount(users, { prefix: '/api' })] });

    const response = await app.fetch(new Request('http://local.test/api/users'));

    expect(response.status).toBe(200);
  });

  test('mount prefix composes with collection prefix', async () => {
    const users = createRoutes({
      prefix: '/users',
      routes: [route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id })))]
    });
    const app = createApp({ routes: [mount(users, { prefix: '/api' })] });

    const response = await app.fetch(new Request('http://local.test/api/users/42'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: '42' });
  });

  test('root route under prefix behaves correctly', async () => {
    const routes = createRoutes({ prefix: '/api', routes: [route('GET', '/', () => ok(json({ root: true })))] });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/api'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ root: true });
  });

  test('duplicate slash normalization', async () => {
    const routes = createRoutes({ prefix: '//users//', routes: [route('GET', '//:id//', (ctx) => ok(json({ id: ctx.params.id })))] });
    const app = createApp({ routes: [mount(routes, { prefix: '//api//' })] });

    const response = await app.fetch(new Request('http://local.test/api/users/7'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: '7' });
  });

  test('static specificity works under prefix', async () => {
    const users = createRoutes({
      prefix: '/users',
      routes: [
        route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id }))),
        route('GET', '/me', () => ok(json({ id: 'me' })))
      ]
    });
    const app = createApp({ routes: [mount(users, { prefix: '/api' })] });

    const response = await app.fetch(new Request('http://local.test/api/users/me'));

    expect(await response.json()).toEqual({ id: 'me' });
  });

  test('original collection and routes are not mutated', () => {
    const child = route('GET', '/:id', () => ok(json({ ok: true })));
    const users = createRoutes({ prefix: '/users', routes: [child] });

    createApp({ routes: [mount(users, { prefix: '/api' })] });

    expect(users.prefix).toBe('/users');
    expect(child.path).toBe('/:id');
  });
});
