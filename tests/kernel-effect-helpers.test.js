import { describe, expect, test } from 'bun:test';

import { call, context, createApp, createRoutes, effect, json, ok, route, runEffect, value } from '../src/index.js';

describe('kernel effect command helpers', () => {
  test('call returns stable command shape', () => {
    const fn = () => 'ok';

    expect(call(fn, 1, 2)).toEqual({
      type: 'call',
      fn: fn,
      args: [1, 2],
      meta: null
    });
  });

  test('value returns stable command shape', () => {
    expect(value('pong')).toEqual({
      type: 'value',
      value: 'pong',
      meta: null
    });
  });

  test('context returns stable command shape', () => {
    expect(context('userId')).toEqual({
      type: 'context',
      key: 'userId',
      meta: null
    });
  });

  test('call executes through runEffect', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield call((a, b) => a + b, 2, 3);
    }));

    expect(result).toBe(5);
  });

  test('value executes through runEffect', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield value('generated');
    }));

    expect(result).toBe('generated');
  });

  test('context reads from context through runEffect', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield context('path');
    }), { path: '/ctx' });

    expect(result).toBe('/ctx');
  });

  test('helper commands work in route handlers', async () => {
    const app = createApp({
      routes: [route('GET', '/hello', effect(function* hello(ctx) {
        const message = yield call((name) => `hello ${name}`, ctx.query.name);
        return ok(json({ message }));
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/hello?name=potentia'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'hello potentia' });
  });

  test('helper commands work in app hooks', async () => {
    const calls = [];
    const app = createApp({
      hooks: { beforeRequest: [effect(function* before() {
        calls.push(yield context('path'));
      })] },
      routes: [route('GET', '/hook', () => ok(json({ ok: true })))]
    });

    await app.fetch(new Request('http://local.test/hook'));

    expect(calls).toEqual(['/hook']);
  });

  test('helper commands work in scoped hooks', async () => {
    const routes = createRoutes({
      hooks: {
        afterResponse: [effect(function* after(ctx, response) {
          const headerValue = yield value('yes');
          response.headers.set('x-effect-helper', headerValue);
          return response;
        })]
      },
      routes: [route('GET', '/items', () => ok(json({ ok: true })))]
    });
    const app = createApp({ routes: [routes] });

    const response = await app.fetch(new Request('http://local.test/items'));

    expect(response.headers.get('x-effect-helper')).toBe('yes');
  });

  test('raw command compatibility still works', async () => {
    const result = await runEffect(effect(function* workflow() {
      const one = yield { type: 'value', value: 1 };
      const two = yield { type: 'call', fn: (value) => value + 1, args: [one] };
      const prefix = yield { type: 'context', key: 'prefix' };
      return prefix + two;
    }), { prefix: 'raw-' });

    expect(result).toBe('raw-2');
  });
});
