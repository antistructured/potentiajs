import { describe, expect, test } from 'bun:test';

import { call, context, createApp, effect, json, ok, route } from '../src/index.js';
import { runEffect } from '../src/kernel/effect.js';

describe('kernel effect command validation', () => {
  test('unknown command fails', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'unknown' };
    }))).rejects.toThrow('Unsupported effect command type: unknown');
  });

  test('invalid call command fails', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'call', fn: 'not-a-function', args: [] };
    }))).rejects.toThrow('Invalid effect call command: fn must be a function');
  });

  test('invalid call args fail', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'call', fn: () => null, args: 'bad' };
    }))).rejects.toThrow('Invalid effect call command: args must be an array when provided');
  });

  test('invalid context command fails', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'context', key: '' };
    }))).rejects.toThrow('Invalid effect context command: key must be a non-empty string');
  });

  test('malformed command fails', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 123 };
    }))).rejects.toThrow('Invalid effect command: type must be a string');
  });

  test('yielded non-command values still pass through', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield 'plain';
    }));

    expect(result).toBe('plain');
  });

  test('invalid command in route returns safe handler failure', async () => {
    const app = createApp({
      routes: [route('GET', '/bad', effect(function* bad() {
        yield { type: 'call', fn: null, args: [] };
        return ok(json({ ok: true }));
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/bad'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('invalid command in hook normalizes deterministically', async () => {
    const app = createApp({
      hooks: { beforeRequest: [effect(function* before() { yield { type: 'context', key: null }; })] },
      routes: [route('GET', '/bad-hook', () => ok(json({ ok: true })))]
    });

    const response = await app.fetch(new Request('http://local.test/bad-hook'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('existing valid raw commands still pass', async () => {
    const result = await runEffect(effect(function* workflow() {
      const a = yield { type: 'call', fn: () => 1 };
      const b = yield { type: 'context', key: 'value' };
      return a + b;
    }), { value: 2 });

    expect(result).toBe(3);
  });

  test('valid helper commands still pass validation', async () => {
    const result = await runEffect(effect(function* workflow() {
      return yield call((value) => value, yield context('value'));
    }), { value: 7 });

    expect(result).toBe(7);
  });
});
