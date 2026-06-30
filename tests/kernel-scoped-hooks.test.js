import { describe, expect, test } from 'bun:test';

import { createApp, createRoutes, effect, json, mount, ok, route, text } from '../src/index.js';

describe('kernel scoped hooks', () => {
  test('collection beforeRequest hook runs', async () => {
    const events = [];
    const routes = createRoutes({
      hooks: { beforeRequest: [() => { events.push('collection'); }] },
      routes: [route('GET', '/items', () => ok(json({ ok: true })))]
    });
    const app = createApp({ routes: [routes] });

    await app.fetch(new Request('http://local.test/items'));

    expect(events).toEqual(['collection']);
  });

  test('app and scoped beforeRequest order is deterministic', async () => {
    const events = [];
    const inner = createRoutes({
      hooks: { beforeRequest: [() => { events.push('inner'); }] },
      routes: [route('GET', '/items', () => ok(json({ ok: true })))]
    });
    const outer = createRoutes({
      hooks: { beforeRequest: [() => { events.push('outer'); }] },
      routes: [inner]
    });
    const app = createApp({
      hooks: { beforeRequest: [() => { events.push('app'); }] },
      routes: [outer]
    });

    await app.fetch(new Request('http://local.test/items'));

    expect(events).toEqual(['app', 'outer', 'inner']);
  });

  test('scoped afterResponse order is deterministic', async () => {
    const events = [];
    const inner = createRoutes({
      hooks: { afterResponse: [() => { events.push('inner'); }] },
      routes: [route('GET', '/items', () => ok(json({ ok: true })))]
    });
    const outer = createRoutes({
      hooks: { afterResponse: [() => { events.push('outer'); }] },
      routes: [inner]
    });
    const app = createApp({
      hooks: { afterResponse: [() => { events.push('app'); }] },
      routes: [outer]
    });

    await app.fetch(new Request('http://local.test/items'));

    expect(events).toEqual(['inner', 'outer', 'app']);
  });

  test('scoped onError can recover', async () => {
    const routes = createRoutes({
      hooks: { onError: [() => text('recovered', { status: 209 })] },
      routes: [route('GET', '/boom', () => { throw new Error('boom'); })]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/boom'));

    expect(response.status).toBe(209);
    expect(await response.text()).toBe('recovered');
  });

  test('hooks apply only to child routes', async () => {
    const scoped = createRoutes({
      hooks: { beforeRequest: [() => text('blocked', { status: 210 })] },
      routes: [route('GET', '/scoped', () => ok(json({ scoped: true })))]
    });
    const app = createApp({
      routes: [
        scoped,
        route('GET', '/open', () => ok(json({ open: true })))
      ]
    });

    const blocked = await app.fetch(new Request('http://local.test/scoped'));
    const open = await app.fetch(new Request('http://local.test/open'));

    expect(blocked.status).toBe(210);
    expect(open.status).toBe(200);
    expect(await open.json()).toEqual({ open: true });
  });

  test('sibling route collections do not share scoped hooks', async () => {
    const one = createRoutes({
      prefix: '/one',
      hooks: { beforeRequest: [() => text('one', { status: 211 })] },
      routes: [route('GET', '/', () => ok(json({ one: true })))]
    });
    const two = createRoutes({
      prefix: '/two',
      routes: [route('GET', '/', () => ok(json({ two: true })))]
    });
    const app = createApp({ routes: [one, two] });

    const first = await app.fetch(new Request('http://local.test/one'));
    const second = await app.fetch(new Request('http://local.test/two'));

    expect(first.status).toBe(211);
    expect(second.status).toBe(200);
    expect(await second.json()).toEqual({ two: true });
  });

  test('effect hooks work', async () => {
    const routes = createRoutes({
      hooks: {
        beforeRequest: [effect(function* before() { yield { type: 'value', value: null }; })],
        afterResponse: [effect(function* after(ctx, response) {
          yield { type: 'value', value: null };
          response.headers.set('x-effect-hook', 'yes');
          return response;
        })]
      },
      routes: [route('GET', '/items', () => ok(json({ ok: true })))]
    });
    const app = createApp({ routes: [mount(routes, { prefix: '/api' })] });

    const response = await app.fetch(new Request('http://local.test/api/items'));

    expect(response.headers.get('x-effect-hook')).toBe('yes');
  });

  test('original hook arrays are not mutated', () => {
    const beforeRequest = [() => undefined];
    const hooks = { beforeRequest: beforeRequest };
    const routes = createRoutes({ hooks: hooks, routes: [route('GET', '/items', () => ok(json({ ok: true })))] });

    createApp({ routes: [mount(routes, { hooks: { beforeRequest: [() => undefined] } })] });

    expect(hooks.beforeRequest).toBe(beforeRequest);
    expect(hooks.beforeRequest).toHaveLength(1);
  });
});
