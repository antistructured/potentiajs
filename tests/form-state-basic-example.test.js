import { describe, expect, test } from 'bun:test';

import { action, createApp, fail, json, ok, route } from '../src/index.js';
import { app } from '../examples/form-state-basic/index.js';

describe('form state basic example smoke', () => {
  test('form-state validation failure shape', async () => {
    const response = await postForm('name=Ada&email=invalid&password=secret');
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.kind).toBe('form');
    expect(body.ok).toBe(false);
    expect(body.values).toEqual({ name: 'Ada', email: 'invalid' });
    expect(body.errors.email[0].code).toBe('invalid_email');
    expect(body.issues[0].field).toBe('email');
  });

  test('form-state domain failure shape', async () => {
    const response = await postForm('name=Ada&email=taken%40example.test');
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.kind).toBe('form');
    expect(body.error.code).toBe('USER_EMAIL_TAKEN');
    expect(body.errors._form[0].code).toBe('USER_EMAIL_TAKEN');
    expect(body.values).toEqual({ name: 'Ada', email: 'taken@example.test' });
  });

  test('sensitive value omitted', async () => {
    const response = await postForm('name=Ada&email=invalid&password=secret');
    const body = await response.json();

    expect(body.values.password).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain('secret');
  });

  test('successful action redirects explicitly', async () => {
    const response = await postForm('name=Ada&email=ada%40example.test');

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
  });

  test('default action behavior remains unchanged', async () => {
    const defaultApp = createApp({ routes: [route('POST', '/users', action('users.create', () => fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409)))] });
    const response = await defaultApp.fetch(new Request('http://local.test/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ ok: false, error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, boundary: null, issues: [] });
  });

  test('success form state can be returned as JSON when chosen', async () => {
    const response = await postForm('name=Ada&email=ada%40example.test&mode=json');
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({ ok: true, kind: 'form', errors: {}, issues: [], error: null, value: { id: 'usr_1', email: 'ada@example.test' } });
  });
});

function postForm(body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
