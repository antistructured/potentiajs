import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action URL-encoded errors', () => {
  test('malformed URL-encoded returns safe error', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

    const response = await postForm(app, '/users', 'name=%E0%A4%A');

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action form input was malformed.',
        boundary: 'input',
        issues: [{ message: 'Action form input was malformed.' }]
      },
      boundary: 'input',
      issues: [{ message: 'Action form input was malformed.' }]
    });
  });

  test('dangerous keys do not pollute prototype', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

    const response = await postForm(app, '/users', '__proto__=polluted');

    expect(response.status).toBe(400);
    expect({}.polluted).toBeUndefined();
    expect((await response.json()).error.message).toBe('Action form input contained an unsafe field name.');
  });

  test('raw form body is not exposed', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

    const response = await postForm(app, '/users', 'password=secret&bad=%E0%A4%A');
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('password=secret');
    expect(JSON.stringify(body)).not.toContain('bad=%E0%A4%A');
  });

  test('issue shape is deterministic', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const first = await (await postForm(app, '/users', 'name=Ada')).json();
    const second = await (await postForm(app, '/users', 'name=Ada')).json();

    expect(first.error.issues).toEqual(second.error.issues);
    expect(first.error.boundary).toBe('input');
  });

  test('handler failure behavior is preserved', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => { throw new Error('secret form handler'); }))] });

    const response = await postForm(app, '/users', 'name=Ada');
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('POTENTIA_ACTION_HANDLER_FAILED');
    expect(JSON.stringify(body)).not.toContain('secret form handler');
  });
});

function postForm(app, path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
