import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel generic contract field diagnostics', () => {
  test('function contract failure root issue', async () => {
    const response = await fetchWithContract(() => { throw new Error('secret function parser'); });
    const issue = (await response.json()).issues[0];

    expect(issue).toEqual(rootIssue('parse_failed', 'params'));
  });

  test('parse contract failure root issue', async () => {
    const response = await fetchWithContract({ parse() { throw new Error('secret parse parser'); } });
    const body = await response.json();

    expect(body.issues[0]).toEqual(rootIssue('parse_failed', 'params'));
    expect(JSON.stringify(body)).not.toContain('secret parse parser');
  });

  test('check contract failure root issue', async () => {
    const response = await fetchWithContract({ check: () => false });
    const issue = (await response.json()).issues[0];

    expect(issue).toEqual(rootIssue('check_failed', 'params'));
  });

  test('thrown unsafe message hidden', async () => {
    const response = await fetchWithContract(() => { throw new Error('password=secret'); });
    const body = await response.json();

    expect(JSON.stringify(body)).not.toContain('password=secret');
  });

  test('invalid contract fallback deterministic', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: { nope: true } })] });
    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });

  test('issue shape matches canonical structure', async () => {
    const response = await fetchWithContract({ check: () => false });
    const issue = (await response.json()).issues[0];

    expect(Object.keys(issue)).toEqual(['code', 'message', 'path', 'field', 'boundary', 'source', 'expected', 'received', 'meta']);
  });

  test('generic contract success unchanged', async () => {
    const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: (value) => value })] });
    const response = await app.fetch(new Request('http://local.test/users/1'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});

function fetchWithContract(contract) {
  const app = createApp({ routes: [route('GET', '/users/:id', () => ok(json({ ok: true })), { params: contract })] });
  return app.fetch(new Request('http://local.test/users/1'));
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
