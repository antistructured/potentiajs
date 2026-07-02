import { describe, expect, test } from 'bun:test';

import { createApp, createFrameworkError, effect, json, ok, route } from '../src/index.js';
import { runEffect } from '../src/kernel/effect.js';

describe('kernel effect error diagnostics', () => {
  test('internal unknown command error message is useful', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'mystery' };
    }))).rejects.toThrow('Unsupported effect command type: mystery');
  });

  test('internal invalid call message is useful', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'call', fn: null, args: [] };
    }))).rejects.toThrow('Invalid effect call command: fn must be a function');
  });

  test('internal invalid context message is useful', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'context', key: null };
    }))).rejects.toThrow('Invalid effect context command: key must be a non-empty string');
  });

  test('command execution failure keeps useful internal message', async () => {
    await expect(runEffect(effect(function* workflow() {
      yield { type: 'call', fn: () => { throw new Error('load failed'); }, args: [] };
    }))).rejects.toThrow('load failed');
  });

  test('generator failure keeps useful internal message', async () => {
    await expect(runEffect(effect(function* workflow() {
      throw new Error('generator failed');
    }))).rejects.toThrow('generator failed');
  });

  test('public route response hides effect internals', async () => {
    const app = createApp({
      routes: [route('GET', '/bad', effect(function* bad() {
        yield { type: 'unknown-secret-command' };
        return ok(json({ ok: true }));
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/bad'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('hook error response hides effect internals', async () => {
    const app = createApp({
      hooks: { beforeRequest: [effect(function* before() { yield { type: 'context', key: '' }; })] },
      routes: [route('GET', '/bad-hook', () => ok(json({ ok: true })))]
    });

    const response = await app.fetch(new Request('http://local.test/bad-hook'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('exposed framework errors still behave as designed', async () => {
    const app = createApp({
      routes: [route('GET', '/exposed', effect(function* exposed() {
        throw createFrameworkError('POTENTIA_BAD_REQUEST', 'Effect-visible bad request', {
          status: 400,
          expose: true
        });
      }))]
    });

    const response = await app.fetch(new Request('http://local.test/exposed'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Effect-visible bad request' } });
  });
});
