import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel contract boundary', () => {
  test('function body contract transforms body', async () => {
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => ok(json(ctx.body)), {
        body: (value) => ({ name: value.name.toUpperCase() })
      })]
    });

    const response = await app.fetch(jsonRequest('/users', { name: 'daniel' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'DANIEL' });
  });

  test('parse-style body contract works', async () => {
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => ok(json(ctx.body)), {
        body: { parse: (value) => ({ name: value.name, parsed: true }) }
      })]
    });

    const response = await app.fetch(jsonRequest('/users', { name: 'Daniel' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Daniel', parsed: true });
  });

  test('check-style body contract works', async () => {
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => ok(json(ctx.body)), {
        body: { check: (value) => typeof value.name === 'string' }
      })]
    });

    const response = await app.fetch(jsonRequest('/users', { name: 'Daniel' }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ name: 'Daniel' });
  });

  test('failed body contract returns deterministic 400', async () => {
    const app = createApp({
      routes: [route('POST', '/users', () => ok(json({ created: true })), {
        body: { check: (value) => typeof value.name === 'string' }
      })]
    });

    const response = await app.fetch(jsonRequest('/users', { name: 1 }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_CONTRACT_FAILED', message: 'Request body failed contract validation', boundary: 'body', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('handler receives validated ctx.body', async () => {
    let seenBody = null;
    const app = createApp({
      routes: [route('POST', '/users', (ctx) => {
        seenBody = ctx.body;
        return ok(json({ ok: true }));
      }, {
        body: (value) => ({ id: 1, name: value.name })
      })]
    });

    await app.fetch(jsonRequest('/users', { name: 'Daniel' }));

    expect(seenBody).toEqual({ id: 1, name: 'Daniel' });
  });

  test('response contract validates output', async () => {
    const app = createApp({
      routes: [route('GET', '/users', () => ok(json({ id: 1 })), {
        response: { check: (value) => typeof value.id === 'number' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 1 });
  });

  test('failed response contract returns deterministic 500', async () => {
    const app = createApp({
      routes: [route('GET', '/users', () => ok(json({ id: 'bad' })), {
        response: { check: (value) => typeof value.id === 'number' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users'));

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: { code: 'POTENTIA_RESPONSE_CONTRACT_FAILED', message: 'Response failed contract validation', boundary: 'response', issues: [{ message: 'Contract check returned false' }] } });
  });

  test('no body parsing happens when no body contract exists', async () => {
    const app = createApp({
      routes: [route('POST', '/raw', (ctx) => ok(json({ body: ctx.body })))]
    });

    const response = await app.fetch(new Request('http://local.test/raw', {
      method: 'POST',
      body: '{not-json',
      headers: { 'content-type': 'application/json' }
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ body: null });
  });
});

function jsonRequest(path, body) {
  return new Request(`http://local.test${path}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'content-type': 'application/json' }
  });
}
