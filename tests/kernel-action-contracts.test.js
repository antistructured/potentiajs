import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action input/output contracts', () => {
  test('generic input contract works', async () => {
    const input = (value) => ({ ...value, normalized: true });
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input)), { input: input }))]
    });

    const response = await postJson(app, '/users', { name: 'Ada' });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada', normalized: true });
  });

  test('SigilJS input contract works', async () => {
    const Input = sigil({ name: String });
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input)), { input: Input }))]
    });

    const response = await postJson(app, '/users', { name: 'Ada' });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada' });
  });

  test('input contract transforms ctx.input', async () => {
    const input = { parse: (value) => ({ name: value.name.toUpperCase() }) };
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input)), { input: input }))]
    });

    const response = await postJson(app, '/users', { name: 'Ada' });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'ADA' });
  });

  test('failed input contract returns 400', async () => {
    const input = { check: () => false };
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: input }))]
    });

    const response = await postJson(app, '/users', { name: 'Ada' });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action input contract failed.',
        boundary: 'input',
        issues: [{ message: 'Contract check returned false' }]
      },
      boundary: 'input',
      issues: [{ message: 'Contract check returned false' }]
    });
  });

  test('generic output contract works', async () => {
    const output = (value) => ({ ...value, outputContracted: true });
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), { output: output }))]
    });

    const response = await postJson(app, '/users', {});

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'usr_1', outputContracted: true });
  });

  test('SigilJS output contract works', async () => {
    const Output = sigil({ id: String, name: String });
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1', name: 'Ada' })), { output: Output }))]
    });

    const response = await postJson(app, '/users', {});

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'usr_1', name: 'Ada' });
  });

  test('failed output contract returns 500', async () => {
    const output = { check: () => false };
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), { output: output }))]
    });

    const response = await postJson(app, '/users', {});

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_OUTPUT_FAILED',
        message: 'Action output contract failed.',
        boundary: 'output',
        issues: [{ message: 'Contract check returned false' }]
      },
      boundary: 'output',
      issues: [{ message: 'Contract check returned false' }]
    });
  });

  test('route response contract runs after action output contract', async () => {
    const output = (value) => ({ ...value, actionOutput: true });
    const responseContract = (value) => ({ ...value, routeResponse: true });
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), { output: output }), {
        response: responseContract
      })]
    });

    const response = await postJson(app, '/users', {});

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'usr_1', actionOutput: true, routeResponse: true });
  });

  test('contracts are not executed during action construction', () => {
    let ran = false;
    action('users.create', () => 'ok', {
      input: { parse: (value) => { ran = true; return value; } },
      output: { parse: (value) => { ran = true; return value; } }
    });

    expect(ran).toBe(false);
  });
});

function postJson(app, path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }));
}
