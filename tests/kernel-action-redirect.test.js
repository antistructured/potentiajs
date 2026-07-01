import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, redirect, route } from '../src/index.js';

describe('kernel action redirect semantics', () => {
  test('action returns redirect with default status and location', async () => {
    const app = createActionApp(() => redirect('/users'));
    const response = await postJson(app, {});

    expect(response.status).toBe(302);
    expect(response.headers.get('location')).toBe('/users');
    expect(await response.text()).toBe('');
  });

  test('action returns redirect with custom status', async () => {
    const app = createActionApp(() => redirect('/users', 303));
    const response = await postJson(app, {});

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
  });

  test('URL-encoded action can redirect', async () => {
    const app = createActionApp(() => redirect('/users', 303));
    const response = await postForm(app, 'name=Ada');

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
  });

  test('JSON action can redirect', async () => {
    const app = createActionApp(() => redirect('/users', 303));
    const response = await postJson(app, { name: 'Ada' });

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
  });

  test('action output contract bypasses redirect responses', async () => {
    let ran = false;
    const output = { parse: (value) => { ran = true; return value; } };
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => redirect('/users', 303), { output: output }))] });

    const response = await postJson(app, {});

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
    expect(ran).toBe(false);
  });

  test('route response contract bypasses redirect responses', async () => {
    let ran = false;
    const responseContract = { parse: (value) => { ran = true; return value; } };
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => redirect('/users', 303)), {
        response: responseContract
      })]
    });

    const response = await postJson(app, {});

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
    expect(ran).toBe(false);
  });

  test('redirect does not execute output contract logic', async () => {
    let count = 0;
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => {
      count += 1;
      return redirect('/users', 303);
    }, { output: { parse: () => { count += 100; return {}; } } }))] });

    const response = await postJson(app, {});

    expect(response.status).toBe(303);
    expect(count).toBe(1);
  });

  test('normal action output contracts still run for non-redirects', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), {
      output: (value) => ({ ...value, checked: true })
    }))] });

    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'usr_1', checked: true });
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
