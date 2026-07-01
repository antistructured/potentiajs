import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action URL-encoded contracts', () => {
  test('SigilJS input contract accepts URL-encoded input', async () => {
    const Input = sigil({ name: String, email: String });
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input)), { input: Input }))] });

    const response = await postForm(app, '/users', 'name=Ada&email=ada%40example.com');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ name: 'Ada', email: 'ada@example.com' });
  });

  test('generic input contract transforms URL-encoded input', async () => {
    const input = (value) => ({ ...value, count: Number(value.count) });
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json(ctx.input)), { input: input }))] });

    const response = await postForm(app, '/users', 'count=2');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ count: 2 });
  });

  test('failed input contract returns 400', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: { check: () => false } }))] });

    const response = await postForm(app, '/users', 'name=Ada');

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action input contract failed.',
        boundary: 'input',
        issues: [{ message: 'Contract check returned false' }]
      },
      boundary: 'input',
      issues: [{ message: 'Contract check returned false' }]
    });
  });

  test('output contract still works', async () => {
    const output = sigil({ id: String, name: String });
    const app = createApp({ routes: [route('POST', '/users', action('users.create', (ctx) => ok(json({ id: 'usr_1', name: ctx.input.name })), { output: output }))] });

    const response = await postForm(app, '/users', 'name=Ada');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ id: 'usr_1', name: 'Ada' });
  });
});

function postForm(app, path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
