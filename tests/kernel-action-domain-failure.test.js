import { describe, expect, test } from 'bun:test';

import { action, createApp, fail, json, ok, route } from '../src/index.js';

describe('kernel action domain failure conventions', () => {
  test('domain failure returns chosen status', async () => {
    const app = createActionApp(() => fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409));
    const response = await postJson(app, { email: 'ada@example.test' });

    expect(response.status).toBe(409);
  });

  test('domain failure body is deterministic', async () => {
    const app = createActionApp(() => fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409));
    const response = await postJson(app, { email: 'ada@example.test' });

    expect(await response.json()).toEqual({
      ok: false,
      error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' },
      boundary: null,
      issues: []
    });
  });

  test('domain failure works with JSON input', async () => {
    const app = createActionApp((ctx) => {
      if (ctx.input.email === 'taken@example.test') return fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409);
      return ok(json({ ok: true }));
    });

    const response = await postJson(app, { email: 'taken@example.test' });

    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe('USER_EMAIL_TAKEN');
  });

  test('domain failure works with URL-encoded input', async () => {
    const app = createActionApp((ctx) => {
      if (ctx.input.email === 'taken@example.test') return fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409);
      return ok(json({ ok: true }));
    });

    const response = await postForm(app, 'email=taken%40example.test');

    expect(response.status).toBe(409);
    expect((await response.json()).error.code).toBe('USER_EMAIL_TAKEN');
  });

  test('output contract does not run for domain failure', async () => {
    let ran = false;
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409), {
      output: { parse: (value) => { ran = true; return value; } }
    }))] });

    const response = await postJson(app, {});

    expect(response.status).toBe(409);
    expect(ran).toBe(false);
  });

  test('unsafe thrown errors remain separate from intentional domain failures', async () => {
    const app = createActionApp(() => { throw new Error('database says email taken secret'); });
    const response = await postJson(app, {});
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('POTENTIA_ACTION_HANDLER_FAILED');
    expect(JSON.stringify(body)).not.toContain('database says email taken secret');
  });
});

function createActionApp(handler) {
  return createApp({ routes: [route('POST', '/users', action('users.create', handler))] });
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
