import { describe, expect, test } from 'bun:test';

import { createApp, effect, json, ok, route } from '../src/index.js';
import { runEffect } from '../src/kernel/effect.js';

describe('kernel effect execution', () => {
  test('plain handler works', async () => {
    const result = await runEffect(() => 'plain', { value: 1 });

    expect(result).toBe('plain');
  });

  test('async handler works', async () => {
    const result = await runEffect(async () => 'async', { value: 1 });

    expect(result).toBe('async');
  });

  test('generator effect handler works', async () => {
    const result = await runEffect(effect(function* workflow() {
      const value = yield { type: 'value', value: 'generated' };
      return value;
    }), {});

    expect(result).toBe('generated');
  });

  test('yielded call executes', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield { type: 'call', fn: (a, b) => a + b, args: [2, 3] };
    }), {});

    expect(result).toBe(5);
  });

  test('yielded context reads from context', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield { type: 'context', key: 'path' };
    }), { path: '/ctx' });

    expect(result).toBe('/ctx');
  });

  test('thrown effect error normalizes through app response', async () => {
    const app = createApp({
      routes: [route('GET', '/boom', effect(function* boom() {
        yield { type: 'call', fn: () => { throw new Error('boom'); }, args: [] };
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/boom'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('app routes can use effect handlers', async () => {
    const app = createApp({
      routes: [route('GET', '/', effect(function* home(ctx) {
        const message = yield { type: 'call', fn: (name) => `hello ${name}`, args: [ctx.query.name] };
        return ok(json({ message }));
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/?name=potentia'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ message: 'hello potentia' });
  });
});
