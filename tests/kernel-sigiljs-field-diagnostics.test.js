import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, createApp, json, ok, route } from '../src/index.js';
import { sigilIssueFromError } from '../src/kernel/diagnostics.js';

describe('kernel SigilJS field diagnostics', () => {
  test('missing required field produces field-level issue when SigilJS exposes path', async () => {
    const response = await postJson(createActionApp({ name: String, email: String }), { name: 'Ada' });
    const issue = (await response.json()).issues[0];

    expect(response.status).toBe(400);
    expect(issue.source).toBe('sigil');
    expect(issue.path).toEqual(['email']);
    expect(issue.field).toBe('email');
    expect(issue.code).toBe('missing_required');
  });

  test('invalid field type produces field-level issue', async () => {
    const response = await postJson(createActionApp({ email: String }), { email: 42 });
    const issue = (await response.json()).issues[0];

    expect(issue.source).toBe('sigil');
    expect(issue.path).toEqual(['email']);
    expect(issue.field).toBe('email');
    expect(issue.expected).toBe('string');
    expect(issue.received).toBe('number');
  });

  test('nested invalid field produces nested path when available', async () => {
    const response = await postJson(createActionApp({ profile: { name: String } }), { profile: { name: 42 } });
    const issue = (await response.json()).issues[0];

    expect(issue.source).toBe('sigil');
    expect(issue.path).toEqual(['profile', 'name']);
    expect(issue.field).toBe('profile.name');
  });

  test('array/repeated issue normalizes if available', async () => {
    const response = await postForm(createActionApp({ tags: String }), 'tags=alpha&tags=beta');
    const issue = (await response.json()).issues[0];

    expect(issue.source).toBe('sigil');
    expect(issue.path.length).toBeGreaterThanOrEqual(0);
    expect(issue.field === null || typeof issue.field === 'string').toBe(true);
  });

  test('actual/raw input value is not exposed', async () => {
    const response = await postJson(createActionApp({ email: Number }), { email: 'secret@example.test' });
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('secret@example.test');
    expect(body.issues[0].received).toBe('string');
  });

  test('fallback root-level issue works when structured shape unavailable', () => {
    const issue = sigilIssueFromError({ code: 'SIGIL_VALIDATION_FAILED', path: 'email' }, 'input');

    expect(issue).toEqual({
      code: 'contract_failed',
      message: 'SigilJS contract rejected value',
      path: [],
      field: null,
      boundary: 'input',
      source: 'sigil',
      expected: null,
      received: null,
      meta: null
    });
  });

  test('issue shape is deterministic', async () => {
    const app = createActionApp({ email: String });
    const first = await (await postJson(app, { email: 1 })).json();
    const second = await (await postJson(app, { email: 1 })).json();

    expect(first.issues).toEqual(second.issues);
  });
});

function createActionApp(shape) {
  return createApp({ routes: [route('POST', '/users', action('users.create', () => ok(json({ unreachable: true })), { input: sigil(shape) }))] });
}

function postJson(app, body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  }));
}

function postForm(app, body) {
  return app.fetch(new Request('http://local.test/users', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: body
  }));
}
