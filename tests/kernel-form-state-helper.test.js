import { describe, expect, test } from 'bun:test';

import { action, createApp, createFormState, fail, json, ok, route } from '../src/index.js';

describe('kernel form state helper', () => {
  test('creates failed form state', () => {
    const state = createFormState({
      ok: false,
      values: { name: 'Ada' },
      issues: [formIssue('email')],
      error: { code: 'POTENTIA_ACTION_INPUT_FAILED', message: 'Action input contract failed.' }
    });

    expect(state).toMatchObject({
      ok: false,
      kind: 'form',
      values: { name: 'Ada' },
      errors: { email: [formIssue('email')] },
      issues: [formIssue('email')],
      error: { code: 'POTENTIA_ACTION_INPUT_FAILED', message: 'Action input contract failed.' },
      value: null,
      meta: null
    });
  });

  test('creates success form state', () => {
    expect(createFormState({ ok: true, value: { id: 'usr_1' } })).toEqual({
      ok: true,
      kind: 'form',
      values: {},
      errors: {},
      issues: [],
      error: null,
      value: { id: 'usr_1' },
      meta: null
    });
  });

  test('derives errors from issues', () => {
    const state = createFormState({ issues: [formIssue('email'), formIssue(null)] });

    expect(Object.keys(state.errors)).toEqual(['email', '_form']);
  });

  test('preserves safe values', () => {
    expect(createFormState({ values: { name: 'Ada', tags: ['a', 'b'] } }).values).toEqual({ name: 'Ada', tags: ['a', 'b'] });
  });

  test('omits sensitive values', () => {
    expect(createFormState({ values: { email: 'ada@example.test', password: 'secret' } }).values).toEqual({ email: 'ada@example.test' });
  });

  test('preserves normalized issues array', () => {
    const state = createFormState({ issues: [formIssue('email')] });

    expect(state.issues).toEqual([formIssue('email')]);
  });

  test('defaults are deterministic', () => {
    expect(createFormState()).toEqual({
      ok: false,
      kind: 'form',
      values: {},
      errors: {
        _form: [{
          code: 'FORM_FAILED',
          message: 'Form submission failed',
          path: [],
          field: null,
          boundary: 'handler',
          source: 'framework',
          expected: null,
          received: null,
          meta: null
        }]
      },
      issues: [{
        code: 'FORM_FAILED',
        message: 'Form submission failed',
        path: [],
        field: null,
        boundary: 'handler',
        source: 'framework',
        expected: null,
        received: null,
        meta: null
      }],
      error: { code: 'FORM_FAILED', message: 'Form submission failed' },
      value: null,
      meta: null
    });
  });

  test('helper does not mutate input', () => {
    const input = { values: { name: 'Ada', password: 'secret' }, issues: [formIssue('email')] };
    const before = JSON.stringify(input);

    createFormState(input);

    expect(JSON.stringify(input)).toBe(before);
  });

  test('default action behavior unchanged', async () => {
    const app = createApp({ routes: [route('POST', '/users', action('users.create', () => fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409)))] });
    const response = await app.fetch(new Request('http://local.test/users', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' }));

    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ ok: false, error: { code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, boundary: null, issues: [] });
  });
});

function formIssue(field) {
  return {
    code: 'invalid_type',
    message: 'Invalid value',
    path: field ? [field] : [],
    field: field,
    boundary: 'input',
    source: 'sigil',
    expected: 'string',
    received: 'number',
    meta: null
  };
}
