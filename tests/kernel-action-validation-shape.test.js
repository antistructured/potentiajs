import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action validation failure shape', () => {
  test('input validation failure body is deterministic', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const response = await postJson(app, { name: 'Ada' });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject(inputFailureBody([{ message: 'Contract check returned false' }]));
  });

  test('URL-encoded validation failure body is deterministic', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const response = await postForm(app, 'name=Ada');

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject(inputFailureBody([{ message: 'Contract check returned false' }]));
  });

  test('JSON malformed validation failure body is deterministic', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

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

  test('error code boundary and issues are present', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const body = await (await postJson(app, {})).json();

    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('POTENTIA_ACTION_INPUT_FAILED');
    expect(body.boundary).toBe('input');
    expect(body.issues).toMatchObject([{ message: 'Contract check returned false' }]);
  });

  test('output validation remains safe', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), { output: { check: () => false } }))] });

    const response = await postJson(app, {});
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('POTENTIA_ACTION_OUTPUT_FAILED');
    expect(body.boundary).toBe('output');
  });

  test('handler failure remains safe', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => { throw new Error('secret input'); }))] });

    const response = await postJson(app, {});
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
    expect(body.error.code).toBe('POTENTIA_ACTION_HANDLER_FAILED');
    expect(JSON.stringify(body)).not.toContain('secret input');
  });

  test('raw input body is not exposed', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const response = await postForm(app, 'password=secret');
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('password=secret');
    expect(JSON.stringify(body)).not.toContain('secret');
  });
});

function inputFailureBody(issues) {
  return {
    ok: false,
    error: {
      code: 'POTENTIA_ACTION_INPUT_FAILED',
      message: 'Action input contract failed.',
      boundary: 'input',
      issues: issues
    },
    boundary: 'input',
    issues: issues
  };
}

function postJson(app, body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }));
}

function postForm(app, body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
