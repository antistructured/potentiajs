import { describe, expect, test } from 'bun:test';

import { createRootIssue, deriveField, normalizeIssue, normalizeIssues, safeReceived } from '../src/kernel/diagnostics.js';

describe('kernel field issue normalization', () => {
  test('root issue shape', () => {
    expect(createRootIssue({ boundary: 'input', source: 'generic' })).toEqual({
      code: 'contract_failed',
      message: 'Contract rejected value',
      path: [],
      field: null,
      boundary: 'input',
      source: 'generic',
      expected: null,
      received: null,
      meta: null
    });
  });

  test('single field path', () => {
    expect(normalizeIssue({ path: ['email'] }, { boundary: 'input', source: 'generic' }).field).toBe('email');
  });

  test('nested path', () => {
    expect(normalizeIssue({ path: ['profile', 'name'] }, { boundary: 'input', source: 'generic' }).field).toBe('profile.name');
  });

  test('array index path', () => {
    expect(normalizeIssue({ path: ['tags', 0] }, { boundary: 'input', source: 'generic' }).field).toBe('tags[0]');
  });

  test('mixed path', () => {
    expect(deriveField(['items', 2, 'name'])).toBe('items[2].name');
  });

  test('invalid path fallback', () => {
    expect(normalizeIssue({ path: 'email' }, { boundary: 'input', source: 'generic' }).path).toEqual([]);
    expect(normalizeIssue({ path: ['', {}, -1, 'email'] }, { boundary: 'input', source: 'generic' }).path).toEqual(['email']);
  });

  test('root field derivation', () => {
    expect(deriveField([])).toBeNull();
  });

  test('safe received for primitives', () => {
    expect(safeReceived('ada@example.test')).toBe('string');
    expect(safeReceived(1)).toBe('number');
    expect(safeReceived(false)).toBe('boolean');
    expect(safeReceived(null)).toBe('null');
  });

  test('safe received for object array and function', () => {
    expect(safeReceived({ secret: 'value' })).toBe('object');
    expect(safeReceived(['secret'])).toBe('array');
    expect(safeReceived(() => 'secret')).toBe('function');
  });

  test('no raw object value exposure', () => {
    const issue = normalizeIssue({ received: { password: 'secret' } }, { boundary: 'input', source: 'generic' });

    expect(issue.received).toBe('object');
    expect(JSON.stringify(issue)).not.toContain('secret');
  });

  test('deterministic normalized shape and ordering', () => {
    const issues = normalizeIssues([
      { path: ['b'], code: 'z', message: 'Z' },
      { path: ['a'], code: 'a', message: 'A' }
    ], { boundary: 'input', source: 'generic' });

    expect(issues.map((issue) => issue.field)).toEqual(['a', 'b']);
    expect(Object.keys(issues[0])).toEqual(['code', 'message', 'path', 'field', 'boundary', 'source', 'expected', 'received', 'meta']);
  });
});
