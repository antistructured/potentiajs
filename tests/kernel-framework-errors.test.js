import { describe, expect, test } from 'bun:test';

import { createApp, createFrameworkError, fail, json, normalizeFrameworkError, ok, route } from '../src/index.js';

describe('kernel typed framework errors', () => {
  test('createFrameworkError creates stable shape', () => {
    const error = createFrameworkError('POTENTIA_BAD_REQUEST', 'Bad input', {
      status: 400,
      detail: { field: 'name' },
      cause: new Error('cause'),
      expose: true
    });

    expect(Object.keys(error)).toEqual(['name', 'code', 'message', 'status', 'detail', 'cause', 'expose']);
    expect(error.name).toBe('PotentiaError');
    expect(error.code).toBe('POTENTIA_BAD_REQUEST');
    expect(error.message).toBe('Bad input');
    expect(error.status).toBe(400);
    expect(error.detail).toEqual({ field: 'name' });
    expect(error.expose).toBe(true);
  });

  test('normalizeFrameworkError normalizes unknown errors safely', () => {
    const error = normalizeFrameworkError(new Error('secret boom'));

    expect(error.name).toBe('PotentiaError');
    expect(error.code).toBe('POTENTIA_HANDLER_FAILED');
    expect(error.message).toBe('Internal server error');
    expect(error.status).toBe(500);
    expect(error.expose).toBe(false);
  });

  test('404 returns typed error body', async () => {
    const app = createApp({ routes: [] });

    const response = await app.fetch(new Request('http://local.test/missing'));

    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_NOT_FOUND', message: 'No route matched the request path' } });
  });

  test('405 returns typed error body', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })))] });

    const response = await app.fetch(new Request('http://local.test/users/1', { method: 'POST' }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_METHOD_NOT_ALLOWED', message: 'Route matched the path, but not the request method' } });
  });

  test('body contract failure uses typed error code', async () => {
    const app = createApp({
      routes: [route('POST', '/users', () => ok(json({ ok: true })), {
        body: { check: (body) => typeof body.name === 'string' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 1 })
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Request body failed contract validation', boundary: 'body', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('response contract failure uses typed error code', async () => {
    const app = createApp({
      routes: [route('GET', '/users', () => ok(json({ id: 'bad' })), {
        response: { check: (body) => typeof body.id === 'number' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_RESPONSE_CONTRACT_FAILED', message: 'Response failed contract validation', boundary: 'response', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('thrown handler error hides unsafe message', async () => {
    const app = createApp({ routes: [route('GET', '/boom', () => { throw new Error('database password leaked'); })] });

    const response = await app.fetch(new Request('http://local.test/boom'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('exposed error shows safe message', async () => {
    const app = createApp({
      routes: [route('GET', '/bad', () => fail(createFrameworkError('POTENTIA_BAD_REQUEST', 'Safe bad request', { status: 400, expose: true })))]
    });

    const response = await app.fetch(new Request('http://local.test/bad'));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Safe bad request' } });
  });
});
