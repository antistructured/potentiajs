import { describe, expect, test } from 'bun:test';

import { action, createApp, createFrameworkError, fail, json, ok, route } from '../src/index.js';

describe('kernel action errors', () => {
  test('malformed JSON error shape', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({}))))] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{'
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action input JSON was malformed.',
        boundary: 'input',
        issues: [{ message: 'Action input JSON was malformed.' }]
      },
      boundary: 'input',
      issues: [{ message: 'Action input JSON was malformed.' }]
    });
  });

  test('input failure code and status', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({})), { input: { check: () => false } }))]
    });

    const response = await postJson(app, '/users', { name: 'Ada' });

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('POTENTIA_ACTION_INPUT_FAILED');
  });

  test('output failure code and status', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), { output: { check: () => false } }))]
    });

    const response = await postJson(app, '/users', {});

    expect(response.status).toBe(500);
    expect((await response.json()).error.code).toBe('POTENTIA_ACTION_OUTPUT_FAILED');
  });

  test('handler thrown error code and status', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => {
        throw new Error('database password leaked');
      }))]
    });

    const response = await postJson(app, '/users', {});
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('POTENTIA_ACTION_HANDLER_FAILED');
    expect(body.error.message).toBe('Internal server error');
  });

  test('unsafe handler message is hidden', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => {
        throw new Error('secret token');
      }))]
    });

    const response = await postJson(app, '/users', {});
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('secret token');
  });

  test('diagnostics include boundary', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({})), { input: { check: () => false } }))]
    });

    const response = await postJson(app, '/users', {});
    const body = await response.json();

    expect(body.error.boundary).toBe('input');
  });

  test('issues are deterministic', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({})), { output: { check: () => false } }))]
    });

    const first = await (await postJson(app, '/users', {})).json();
    const second = await (await postJson(app, '/users', {})).json();

    expect(first.error.issues).toEqual(second.error.issues);
    expect(first.error.issues).toMatchObject([{ message: 'Contract check returned false' }]);
  });

  test('safe exposed framework errors still behave when returned', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => fail(createFrameworkError('POTENTIA_BAD_REQUEST', 'Custom bad request', {
        status: 400,
        expose: true
      }))))]
    });

    const response = await postJson(app, '/users', {});
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toMatchObject({ code: 'POTENTIA_BAD_REQUEST', message: 'Custom bad request' });
  });
});

function postJson(app, path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }));
}
