import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel field diagnostics safety', () => {
  test('raw email-like input not exposed as received', async () => {
    const body = await postJson(actionApp({ input: sigil({ email: Number }) }), { email: 'secret@example.test' });

    expect(body.issues[0].received).toBe('string');
    expect(JSON.stringify(body)).not.toContain('secret@example.test');
  });

  test('raw object input not exposed', async () => {
    const body = await postJson(actionApp({ input: { parse() { throw new Error('bad object'); } } }), { password: 'secret' });

    expect(JSON.stringify(body)).not.toContain('password');
    expect(JSON.stringify(body)).not.toContain('secret');
  });

  test('raw array input not exposed', async () => {
    const body = await postJson(actionApp({ input: sigil({ tags: String }) }), { tags: ['secret'] });

    expect(JSON.stringify(body)).not.toContain('secret');
  });

  test('thrown contract message not exposed', async () => {
    const body = await postJson(actionApp({ input: { parse() { throw new Error('secret contract message'); } } }), {});

    expect(JSON.stringify(body)).not.toContain('secret contract message');
  });

  test('thrown handler message not exposed', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => { throw new Error('secret handler message'); }))] });
    const body = await postJson(app, {});

    expect(JSON.stringify(body)).not.toContain('secret handler message');
  });

  test('URL-encoded raw body not exposed', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({}))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'password=secret&bad=%E0%A4%A'
    }));
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('password=secret');
    expect(JSON.stringify(body)).not.toContain('bad=%E0%A4%A');
  });

  test('__proto__ / dangerous keys remain safe', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({}))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: '__proto__=polluted'
    }));

    expect(response.status).toBe(400);
    expect({}.polluted).toBeUndefined();
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
