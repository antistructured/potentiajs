import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { createApp, json, ok, route } from '../src/index.js';

describe('kernel route contract diagnostic envelope', () => {
  test('route params failure envelope', async () => {
    const body = await failBody('GET', '/users/1', route('GET', '/users/:id', handler, { params: { check: () => false } }));

    expectEnvelope(body, 'POTENTIA_CONTRACT_FAILED', 'params', rootIssue('check_failed', 'params'));
  });

  test('route query failure envelope', async () => {
    const body = await failBody('GET', '/search', route('GET', '/search', handler, { query: { parse() { throw new Error('secret query'); } } }));

    expectEnvelope(body, 'POTENTIA_CONTRACT_FAILED', 'query', rootIssue('parse_failed', 'query'));
    expect(JSON.stringify(body)).not.toContain('secret query');
  });

  test('route headers failure envelope', async () => {
    const body = await failBody('GET', '/secure', route('GET', '/secure', handler, { headers: sigil({ 'x-auth': String }) }));

    expect(body.ok).toBe(false);
    expect(body.boundary).toBe('headers');
    expect(body.issues[0].source).toBe('sigil');
    expect(body.error.issues).toEqual(body.issues);
  });

  test('route body failure envelope', async () => {
    const app = createApp({ routes: [route('POST', '/items', handler, { body: { parse() { throw new Error('secret body'); } } })] });
    const response = await app.fetch(new Request('http://local.test/items', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password: 'secret' })
    }));
    const body = await response.json();

    expect(response.status).toBe(400);
    expectEnvelope(body, 'POTENTIA_CONTRACT_FAILED', 'body', rootIssue('parse_failed', 'body'));
    expect(JSON.stringify(body)).not.toContain('password');
    expect(JSON.stringify(body)).not.toContain('secret body');
  });

  test('route response failure envelope', async () => {
    const body = await failBody('GET', '/items', route('GET', '/items', () => ok(json({ id: 1 })), { response: { check: () => false } }));

    expectEnvelope(body, 'POTENTIA_RESPONSE_CONTRACT_FAILED', 'response', rootIssue('check_failed', 'response'));
  });
});

const handler = () => ok(json({ ok: true }));

async function failBody(method, path, routeValue) {
  const app = createApp({ routes: [routeValue] });
  const response = await app.fetch(new Request(`http://local.test${path}`, { method: method }));
  expect(response.status).toBe(path === '/items' ? 500 : 400);
  return response.json();
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
