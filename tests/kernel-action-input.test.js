import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action JSON input', () => {
  test('JSON body becomes ctx.input', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json({ input: ctx.input }))))]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ input: { name: 'Ada' } });
  });

  test('JSON charset content-type works', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada' });
  });

  test('missing content-type with JSON body is accepted', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada' });
  });

  test('malformed JSON returns deterministic 400', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))]
    });

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

  test('no body gives deterministic null input', async () => {
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json({ input: ctx.input }))))]
    });

    const response = await app.fetch(new Request('http://local.test/users', { method: 'POST' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ input: null });
  });

  test('non-action route behavior is unchanged', async () => {
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => ok(json({ hasInput: Object.prototype.hasOwnProperty.call(ctx, 'input') })))]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ hasInput: false });
  });

  test('ctx.body compatibility is preserved for action routes with route body contracts', async () => {
    const bodyContract = { parse: (value) => ({ ...value, bodyContracted: true }) };
    const app = createApp({
      routes: [route('POST', '/users', action('users.create', (ctx) => ok(json({ input: ctx.input, body: ctx.body }))), {
        body: bodyContract
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      input: { name: 'Ada' },
      body: { name: 'Ada', bodyContracted: true }
    });
  });
});
