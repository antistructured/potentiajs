import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';
import { detectActionContentType } from '../src/kernel/action.js';

describe('kernel action content type detection', () => {
  test('JSON detected', () => {
    expect(detectActionContentType('application/json')).toBe('json');
  });

  test('JSON with charset detected', () => {
    expect(detectActionContentType('application/json; charset=utf-8')).toBe('json');
  });

  test('URL-encoded detected', () => {
    expect(detectActionContentType('application/x-www-form-urlencoded')).toBe('form-urlencoded');
  });

  test('URL-encoded with charset detected', () => {
    expect(detectActionContentType('application/x-www-form-urlencoded; charset=utf-8')).toBe('form-urlencoded');
  });

  test('case-insensitive content type', () => {
    expect(detectActionContentType('Application/X-WWW-Form-Urlencoded; Charset=UTF-8')).toBe('form-urlencoded');
  });

  test('missing content type behavior', async () => {
    expect(detectActionContentType(null)).toBe('missing');

    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada' });
  });

  test('unsupported content type behavior', async () => {
    expect(detectActionContentType('text/plain')).toBe('unsupported');

    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true }))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: 'name=Ada'
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action input content type is unsupported.',
        boundary: 'input',
        issues: [{ message: 'Action input content type is unsupported.' }]
      },
      boundary: 'input',
      issues: [{ message: 'Action input content type is unsupported.' }]
    });
  });

  test('JSON regression still passes', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Ada' })
    }));

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada' });
  });
});
