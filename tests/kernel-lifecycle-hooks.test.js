import { describe, expect, test } from 'bun:test';

import { createApp, effect, json, ok, route, text } from '../src/index.js';

describe('kernel lifecycle hooks', () => {
  test('beforeRequest hook runs', async () => {
    const calls = [];
    const app = createApp({
      hooks: { beforeRequest: [(ctx) => calls.push(ctx.path)] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    await app.fetch(new Request('http://local.test/hook'));

    expect(calls).toEqual(['/hook']);
  });

  test('beforeRequest may short-circuit handler', async () => {
    let handlerRan = false;
    const app = createApp({
      hooks: { beforeRequest: [() => json({ stopped: true }, { status: 202 })] },
      routes: [route('GET', '/hook', () => {
        handlerRan = true;
        return ok(json({ ok: true }));
      })]
    });

    const response = await app.fetch(new Request('http://local.test/hook'));

    expect(handlerRan).toBe(false);
    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ stopped: true });
  });

  test('afterResponse hook runs', async () => {
    const calls = [];
    const app = createApp({
      hooks: { afterResponse: [(ctx, response) => calls.push([ctx.path, response.status])] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    await app.fetch(new Request('http://local.test/hook'));

    expect(calls).toEqual([['/hook', 200]]);
  });

  test('afterResponse may replace response', async () => {
    const app = createApp({
      hooks: { afterResponse: [() => text('replacement', { status: 203 })] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    const response = await app.fetch(new Request('http://local.test/hook'));

    expect(response.status).toBe(203);
    expect(await response.text()).toBe('replacement');
  });

  test('onError hook runs after handler error', async () => {
    const calls = [];
    const app = createApp({
      hooks: { onError: [(ctx, error) => {
        calls.push([ctx.path, error.code]);
        return json({ recovered: true }, { status: 418 });
      }] },
      routes: [route('GET', '/boom', () => { throw new Error('boom'); })]
    });

    const response = await app.fetch(new Request('http://local.test/boom'));

    expect(calls).toEqual([['/boom', 'POTENTIA_HANDLER_FAILED']]);
    expect(response.status).toBe(418);
    expect(await response.json()).toEqual({ recovered: true });
  });

  test('hooks run in declaration order', async () => {
    const calls = [];
    const app = createApp({
      hooks: {
        beforeRequest: [() => calls.push('before-1'), () => calls.push('before-2')],
        afterResponse: [() => calls.push('after-1'), () => calls.push('after-2')]
      },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    await app.fetch(new Request('http://local.test/hook'));

    expect(calls).toEqual(['before-1', 'before-2', 'after-1', 'after-2']);
  });

  test('async hooks work', async () => {
    const calls = [];
    const app = createApp({
      hooks: { beforeRequest: [async () => calls.push('async')] },
      routes: [route('GET', '/hook', () => ok(json({ calls })))]
    });

    const response = await app.fetch(new Request('http://local.test/hook'));

    expect(await response.json()).toEqual({ calls: ['async'] });
  });

  test('effect hooks work', async () => {
    const calls = [];
    const app = createApp({
      hooks: { beforeRequest: [effect(function* before(ctx) {
        const value = yield { type: 'context', key: 'path' };
        calls.push(value || ctx.path);
      })] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    await app.fetch(new Request('http://local.test/hook'));

    expect(calls).toEqual(['/hook']);
  });

  test('hook errors normalize deterministically', async () => {
    const app = createApp({
      hooks: { beforeRequest: [() => { throw new Error('hook secret'); }] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    const response = await app.fetch(new Request('http://local.test/hook'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });
});
