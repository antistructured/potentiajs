import { describe, expect, test } from 'bun:test';

import { action, createApp, json, ok, route } from '../src/index.js';

describe('kernel action diagnostic envelope', () => {
  test('action input failure envelope', async () => {
    const body = await postJson(createActionApp({ input: { check: () => false } }), {});

    expectEnvelope(body, 'POTENTIA_ACTION_INPUT_FAILED', 'input', rootIssue('check_failed', 'input'));
  });

  test('action output failure envelope', async () => {
    const body = await postJson(createActionApp({ output: { check: () => false } }), {});

    expectEnvelope(body, 'POTENTIA_ACTION_OUTPUT_FAILED', 'output', rootIssue('check_failed', 'output'));
  });

  test('JSON action failure envelope', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({}))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{'
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expectEnvelope(body, 'POTENTIA_ACTION_INPUT_FAILED', 'input', frameworkIssue('malformed_input', 'Action input JSON was malformed.'));
  });

  test('URL-encoded action failure envelope', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({}))))] });
    const response = await app.fetch(new Request('http://local.test/users', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: 'name=%E0%A4%A'
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expectEnvelope(body, 'POTENTIA_ACTION_INPUT_FAILED', 'input', frameworkIssue('malformed_input', 'Action form input was malformed.'));
  });

  test('nested compatibility exists', async () => {
    const body = await postJson(createActionApp({ input: { check: () => false } }), {});

    expect(body.error.boundary).toBe(body.boundary);
    expect(body.error.issues).toEqual(body.issues);
  });

  test('unsafe values hidden', async () => {
    const body = await postJson(createActionApp({ input: { parse() { throw new Error('secret parser'); } } }), { password: 'secret' });

    expect(JSON.stringify(body)).not.toContain('secret parser');
    expect(JSON.stringify(body)).not.toContain('password');
  });

  test('status codes preserved', async () => {
    const inputResponse = await rawPost(createActionApp({ input: { check: () => false } }), '{}');
    const outputResponse = await rawPost(createActionApp({ output: { check: () => false } }), '{}');

    expect(inputResponse.status).toBe(400);
    expect(outputResponse.status).toBe(500);
  });
});

function createActionApp(options) {
  return createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ id: 'usr_1' })), options))] });
}

async function postJson(app, body) {
  return (await rawPost(app, JSON.stringify(body))).json();
}

function rawPost(app, body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: body
  }));
}

function expectEnvelope(body, code, boundary, issue) {
  expect(body.ok).toBe(false);
  expect(body.error.code).toBe(code);
  expect(body.error.boundary).toBe(boundary);
  expect(body.boundary).toBe(boundary);
  expect(body.issues).toEqual([issue]);
  expect(body.error.issues).toEqual(body.issues);
}

function rootIssue(code, boundary) {
  return {
    code: code,
    message: code === 'check_failed' ? 'Contract check returned false' : 'Contract parser rejected value',
    path: [],
    field: null,
    boundary: boundary,
    source: 'generic',
    expected: null,
    received: null,
    meta: null
  };
}

function frameworkIssue(code, message) {
  return {
    code: code,
    message: message,
    path: [],
    field: null,
    boundary: 'input',
    source: 'framework',
    expected: null,
    received: null,
    meta: null
  };
}
