import { describe, expect, test } from 'bun:test';

import { action, createApp, createFrameworkError, fail, json, ok, route, text } from '../src/index.js';

describe('kernel action result compatibility', () => {
  test('action returns ok(json(...))', async () => {
    const app = createActionApp(() => ok(json({ id: 'usr_1' })));
    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'usr_1' });
  });

  test('action returns ok(text(...))', async () => {
    const app = createActionApp(() => ok(text('created')));
    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('created');
  });

  test('action returns fail(...)', async () => {
    const app = createActionApp(() => fail(createFrameworkError('POTENTIA_BAD_REQUEST', 'Invalid action', { status: 400, expose: true })));
    const response = await postJson(app, {});

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: 'POTENTIA_BAD_REQUEST', message: 'Invalid action' },
    });
  });

  test('action returns plain object', async () => {
    const app = createActionApp(() => ({ id: 'usr_1' }));
    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'usr_1' });
  });

  test('action returns string', async () => {
    const app = createActionApp(() => 'created');
    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/plain; charset=utf-8');
    expect(await response.text()).toBe('created');
  });

  test('action returns null and undefined as 204', async () => {
    const nullResponse = await postJson(createActionApp(() => null), {});
    const undefinedResponse = await postJson(createActionApp(() => undefined), {});

    expect(nullResponse.status).toBe(204);
    expect(await nullResponse.text()).toBe('');
    expect(undefinedResponse.status).toBe(204);
    expect(await undefinedResponse.text()).toBe('');
  });

  test('action returns native Response', async () => {
    const app = createActionApp(() => new Response('native', { status: 201, headers: { 'x-action': 'yes' } }));
    const response = await postJson(app, {});

    expect(response.status).toBe(201);
    expect(response.headers.get('x-action')).toBe('yes');
    expect(await response.text()).toBe('native');
  });

  test('action throws safely', async () => {
    const app = createActionApp(() => { throw new Error('secret action failure'); });
    const response = await postJson(app, {});
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.code).toBe('POTENTIA_ACTION_HANDLER_FAILED');
    expect(JSON.stringify(body)).not.toContain('secret action failure');
  });

  test('non-action route behavior unchanged', async () => {
    const app = createApp({ routes: [route('POST', '/users', () => ok(json({ route: true })))] });
    const response = await postJson(app, {});

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ route: true });
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
