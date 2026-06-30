import { describe, expect, test } from 'bun:test';

import { createApp, fail, json, ok, redirect, route, text } from '../src/index.js';

describe('kernel response projection', () => {
  test('native Response passes through unchanged', async () => {
    const native = new Response('native', { status: 209 });
    const app = createApp({ routes: [route('GET', '/', () => native)] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response).toBe(native);
    expect(response.status).toBe(209);
    expect(await response.text()).toBe('native');
  });

  test('json descriptor projects to JSON response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => json({ ok: true }, { status: 201 }))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(201);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ ok: true });
  });

  test('text descriptor projects to text response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => text('hello'))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('hello');
  });

  test('redirect descriptor projects to redirect response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => redirect('/next', 303))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/next');
  });

  test('ok(object) projects to JSON response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => ok({ ok: true }))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ ok: true });
  });

  test('ok(string) projects to text response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => ok('hello'))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('hello');
  });

  test('fail(error) projects to error response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => fail({ code: 'POTENTIA_BAD_REQUEST', message: 'Bad request', status: 400, expose: true }))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Bad request' } });
  });

  test('plain object projects to JSON response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => ({ ok: true }))] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.headers.get('content-type')).toBe('application/json');
    expect(await response.json()).toEqual({ ok: true });
  });

  test('string projects to text response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => 'hello')] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('hello');
  });

  test('undefined projects to 204 response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => undefined)] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
  });

  test('null projects to 204 response', async () => {
    const app = createApp({ routes: [route('GET', '/', () => null)] });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(204);
    expect(await response.text()).toBe('');
  });

  test('response contract runs against logical body before projection', async () => {
    const app = createApp({
      routes: [route('GET', '/', () => ok({ id: '1' }), {
        response: (body) => ({ id: Number(body.id) })
      })]
    });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(await response.json()).toEqual({ id: 1 });
  });

  test('response contract does not validate native Response passthrough', async () => {
    const app = createApp({
      routes: [route('GET', '/', () => new Response('native'), {
        response: { check: () => false }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/'));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('native');
  });
});
