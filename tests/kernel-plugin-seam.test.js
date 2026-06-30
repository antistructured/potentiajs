import { describe, expect, test } from 'bun:test';

import { createApp, createPlugin, json, ok, route, text } from '../src/index.js';

describe('kernel plugin seam', () => {
  test('plugin routes mount into app', async () => {
    const plugin = createPlugin({
      name: 'hello',
      routes: [route('GET', '/plugin', () => ok(json({ plugin: true })))]
    });
    const app = createApp({ routes: [], plugins: [plugin] });

    const response = await app.fetch(new Request('http://local.test/plugin'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ plugin: true });
  });

  test('plugin hooks apply to plugin routes', async () => {
    const plugin = createPlugin({
      name: 'secure',
      hooks: { beforeRequest: [() => text('plugin blocked', { status: 212 })] },
      routes: [route('GET', '/plugin', () => ok(json({ plugin: true })))]
    });
    const app = createApp({ plugins: [plugin] });

    const response = await app.fetch(new Request('http://local.test/plugin'));

    expect(response.status).toBe(212);
    expect(await response.text()).toBe('plugin blocked');
  });

  test('plugin hooks do not leak to app routes', async () => {
    const plugin = createPlugin({
      name: 'secure',
      hooks: { beforeRequest: [() => text('plugin blocked', { status: 212 })] },
      routes: [route('GET', '/plugin', () => ok(json({ plugin: true })))]
    });
    const app = createApp({
      routes: [route('GET', '/app', () => ok(json({ app: true })))],
      plugins: [plugin]
    });

    const response = await app.fetch(new Request('http://local.test/app'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ app: true });
  });

  test('plugin contracts apply to plugin routes', async () => {
    const plugin = createPlugin({
      name: 'contracted',
      contracts: { headers: (headers) => ({ auth: headers['x-auth'] }) },
      routes: [route('GET', '/plugin', (ctx) => ok(json({ auth: ctx.headers.auth })))]
    });
    const app = createApp({ plugins: [plugin] });

    const response = await app.fetch(new Request('http://local.test/plugin', { headers: { 'x-auth': 'yes' } }));

    expect(await response.json()).toEqual({ auth: 'yes' });
  });

  test('plugin setup runs', () => {
    const events = [];
    const plugin = createPlugin({
      name: 'setup',
      setup(ctx) {
        events.push(ctx.name);
      }
    });

    createApp({ plugins: [plugin] });

    expect(events).toEqual(['setup']);
  });

  test('plugin setup receives safe app context', () => {
    let received;
    const state = { value: 1 };
    const plugin = createPlugin({
      name: 'setup',
      setup(ctx) {
        received = ctx;
      }
    });

    createApp({ state: state, plugins: [plugin] });

    expect(Object.keys(received)).toEqual(['name', 'state', 'meta']);
    expect(received.state).toBe(state);
    expect(Object.isFrozen(received)).toBe(true);
  });

  test('plugin route matching works with app routes', async () => {
    const plugin = createPlugin({
      name: 'plugin',
      routes: [route('GET', '/users/:id', (ctx) => ok(json({ id: ctx.params.id, source: 'plugin' })))]
    });
    const app = createApp({
      routes: [route('GET', '/', () => ok(json({ source: 'app' })))],
      plugins: [plugin]
    });

    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(await response.json()).toEqual({ id: '1', source: 'plugin' });
  });

  test('plugin object is not mutated', () => {
    const source = {
      name: 'immutable',
      routes: [route('GET', '/plugin', () => ok(json({ plugin: true })))]
    };
    const plugin = createPlugin(source);

    createApp({ plugins: [plugin] });

    expect(Object.keys(source)).toEqual(['name', 'routes']);
    expect(plugin.routes).not.toBe(source.routes);
    expect(source.routes[0].path).toBe('/plugin');
  });
});
