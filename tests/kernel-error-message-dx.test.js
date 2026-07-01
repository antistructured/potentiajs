import { describe, expect, test } from 'bun:test';

import { createApp, createFrameworkError, fail, json, ok, route } from '../src/index.js';

describe('kernel error message DX', () => {
  test('404 message explains path match failure', async () => {
    const app = createApp({ routes: [] });

    const response = await app.fetch(new Request('http://local.test/missing'));

    expect(response.status).toBe(404);
    expect(await response.json()).toMatchObject({
      error: {
        code: 'POTENTIA_NOT_FOUND',
        message: 'No route matched the request path'
      }
    });
  });

  test('405 message explains method mismatch', async () => {
    const app = createApp({ routes: [route('GET', '/users', () => ok(json({ ok: true })))] });

    const response = await app.fetch(new Request('http://local.test/users', { method: 'POST' }));

    expect(response.status).toBe(405);
    expect(response.headers.get('allow')).toBe('GET');
    expect(await response.json()).toMatchObject({
      error: {
        code: 'POTENTIA_METHOD_NOT_ALLOWED',
        message: 'Route matched the path, but not the request method'
      }
    });
  });

  test('bad request message can be explicit and safe', async () => {
    const app = createApp({ routes: [route('GET', '/bad', () => fail(createFrameworkError('POTENTIA_BAD_REQUEST', 'Invalid request input', { status: 400, expose: true })))] });

    const response = await app.fetch(new Request('http://local.test/bad'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Invalid request input' } });
  });

  test('request contract failure identifies the boundary', async () => {
    const app = createApp({
      routes: [route('POST', '/users', () => ok(json({ ok: true })), {
        body: {
          check(value) {
            return typeof value.name === 'string';
          }
        }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({})
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      error: {
        code: 'POTENTIA_CONTRACT_FAILED',
        message: 'Request body failed contract validation',
        boundary: 'body',
        issues: [{ message: 'Contract check returned false' }]
      }
    });
  });

  test('response contract failure hides unsafe internals', async () => {
    const app = createApp({
      routes: [route('GET', '/users', () => ok(json({ name: 'Ada' })), {
        response() {
          throw new Error('secret response internals');
        }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users'));

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({
      error: {
        code: 'POTENTIA_RESPONSE_CONTRACT_FAILED',
        message: 'Response failed contract validation',
        boundary: 'response',
        issues: [{ message: 'Contract parser rejected value' }]
      }
    });
  });

  test('handler failure remains safe', async () => {
    const app = createApp({ routes: [route('GET', '/boom', () => { throw new Error('database password leaked'); })] });

    const response = await app.fetch(new Request('http://local.test/boom'));

    expect(response.status).toBe(500);
    expect(await response.json()).toMatchObject({ error: { code: 'POTENTIA_HANDLER_FAILED', message: 'Internal server error' } });
  });

  test('exposed framework errors keep explicit messages', async () => {
    const app = createApp({ routes: [route('GET', '/bad', () => { throw createFrameworkError('POTENTIA_BAD_REQUEST', 'Human-readable bad request', { status: 400, expose: true }); })] });

    const response = await app.fetch(new Request('http://local.test/bad'));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'POTENTIA_BAD_REQUEST', message: 'Human-readable bad request' } });
  });
});
