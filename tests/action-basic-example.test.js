import { describe, expect, test } from 'bun:test';

import { app, createUser } from '../examples/action-basic/index.js';
import { createRouteManifest, projectAction } from '../src/index.js';

describe('action basic example smoke', () => {
  test('creates a user through explicit action route', async () => {
    const response = await postJson('/users', { name: 'Ada', email: 'ada@example.test' });

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: 'usr_1',
      name: 'Ada',
      email: 'ada@example.test'
    });
  });

  test('returns deterministic validation failure', async () => {
    const response = await postJson('/users', { name: 'Ada' });

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject(inputFailureBody([{ message: 'SigilJS contract rejected value' }]));
  });

  test('accepts URL-encoded form-compatible action input', async () => {
    const response = await postForm('/users', 'name=Ada&email=ada%40example.test');

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({
      id: 'usr_1',
      name: 'Ada',
      email: 'ada@example.test'
    });
  });

  test('URL-encoded validation failure is deterministic', async () => {
    const response = await postForm('/users', 'name=Ada');

    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject(inputFailureBody([{ message: 'SigilJS contract rejected value' }]));
  });

  test('domain failure is deterministic', async () => {
    const response = await postJson('/users', { name: 'Ada', email: 'taken@example.test' });

    expect(response.status).toBe(409);
    expect(await response.json()).toMatchObject({
      ok: false,
      error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' },
      boundary: null,
      issues: []
    });
  });

  test('redirect after successful action is explicit', async () => {
    const response = await postForm('/users/redirect', 'name=Ada&email=ada%40example.test');

    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('/users');
    expect(await response.text()).toBe('');
  });

  test('action projection exposes contract metadata', () => {
    const projection = projectAction(createUser);

    expect(projection.id).toBe('users.create');
    expect(projection.input.fields).toEqual([
      { name: 'name', required: true, kind: 'string', fields: null },
      { name: 'email', required: true, kind: 'string', fields: null }
    ]);
    expect(projection.output.required).toEqual(['id', 'name', 'email']);
    expect(projection.result.redirect).toBe('explicit');
  });

  test('route manifest includes action metadata', () => {
    const manifest = createRouteManifest(app);

    expect(manifest.routes.map((route) => route.id)).toEqual(['POST /users', 'POST /users/redirect']);
    expect(manifest.actions.map((action) => action.id)).toEqual(['users.create', 'users.create.redirect']);
    expect(manifest.actions[0].routeId).toBe('POST /users');
    expect(manifest.actions[1].result.domainFailure).toBe('fail-result');
  });
});

function inputFailureBody(issues) {
  return {
    ok: false,
    error: {
      code: 'POTENTIA_ACTION_INPUT_FAILED',
      message: 'Action input contract failed.',
      boundary: 'input',
      issues: issues
    },
    boundary: 'input',
    issues: issues
  };
}

function postJson(path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }));
}

function postForm(path, body) {
  return app.fetch(new Request(`http://local.test${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
