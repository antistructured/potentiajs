import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action URL-encoded input integration', () => {
  test('URL-encoded action input reaches ctx.input', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });

    const response = await postForm(app, '/users', 'name=Ada&email=ada%40example.com');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Ada', email: 'ada@example.com' });
  });

  test('repeated fields reach ctx.input', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });

    const response = await postForm(app, '/users', 'tag=a&tag=b');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ tag: ['a', 'b'] });
  });

  test('empty values reach ctx.input', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });

    const response = await postForm(app, '/users', 'name=&email=ada%40example.com');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: '', email: 'ada@example.com' });
  });

  test('JSON action input still works', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Ada' });
  });

  test('non-action route behavior unchanged', async () => {
    const app = createApp({ routes: [route('POST', '/users', (ctx) => ok(json({ hasInput: Object.prototype.hasOwnProperty.call(ctx, 'input') })))] });

    const response = await postForm(app, '/users', 'name=Ada');

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ hasInput: false });
  });

  test('unsupported content type fails', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'name=Ada'
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.code).toBe('POTENTIA_ACTION_INPUT_FAILED');
  });

  test('unsupported content type without body remains null input', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json({ input: ctx.input }))))] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' }
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ input: null });
  });

  test('missing content type with URL-encoded-looking body is rejected by JSON path', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      body: 'name=Ada'
    }));

    expect(response.status).toBe(400);
    expect((await response.json()).error.message).toBe('Action input JSON was malformed.');
  });
});

function postForm(app, path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded; charset=utf-8' },
    body: body
  }));
}
