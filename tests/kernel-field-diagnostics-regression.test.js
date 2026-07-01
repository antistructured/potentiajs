import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel field diagnostics regression', () => {
  test('existing action validation shape still includes ok false', async () => {
    const body = await postJson(actionApp({ input: { check: () => false } }), {});

    expect(body.ok).toBe(false);
  });

  test('existing nested error issues compatibility remains', async () => {
    const body = await postJson(actionApp({ input: { check: () => false } }), {});

    expect(body.error.issues).toEqual(body.issues);
    expect(body.error.boundary).toBe(body.boundary);
  });

  test('existing route contract diagnostic DX still includes boundary', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: { check: () => false } })] });
    const body = await (await app.fetch(new Request('http://local.test/users/1'))).json();

    expect(body.error.boundary).toBe('params');
    expect(body.boundary).toBe('params');
  });

  test('existing action example still passes success route', async () => {
    const { app } = await import('../examples/action-basic/index.js');
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada', email: 'ada@example.test' })
    }));

    expect(response.status).toBe(200);
  });

  test('route contract success behavior still passes', async () => {
    const app = createApp({ routes: [route('GET', '/ok', () => ok(json({ ok: true })), { query: (value) => value })] });
    const response = await app.fetch(new Request('http://local.test/ok'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});

function actionApp(options) {
  return createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), options))] });
}

async function postJson(app, body) {
  return (await app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }))).json();
}
