import { describe, expect, test } from 'bun:test';

import { applyContract, applyContractResult, normalizeContract } from '../src/kernel/contract.js';

describe('kernel contract adapter architecture', () => {
  test('function contract still works', () => {
    const result = applyContract((value) => ({ count: Number(value.count) }), { count: '2' });

    expect(result).toEqual({ count: 2 });
  });

  test('parse contract still works', () => {
    const result = applyContract({ parse: (value) => ({ name: value.name.trim() }) }, { name: ' Ada ' });

    expect(result).toEqual({ name: 'Ada' });
  });

  test('check contract still works', () => {
    const value = { ok: true };
    const result = applyContract({ check: (candidate) => candidate.ok === true }, value);

    expect(result).toBe(value);
  });

  test('failed function contract normalizes through result helper', () => {
    const result = applyContractResult(() => { throw new Error('unsafe input value'); }, { secret: 'do-not-leak' });

    expect(result.ok).toBe(false);
    expect(result.value).toBe(null);
    expect(result.error.code).toBe('POTENTIA_CONTRACT_FAILED');
    expect(result.error.message).toBe('Contract failed');
  });

  test('failed parse contract normalizes through result helper', () => {
    const result = applyContractResult({ parse: () => { throw new Error('parse internals'); } }, {});

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('POTENTIA_CONTRACT_FAILED');
    expect(result.error.message).toBe('Contract failed');
  });

  test('failed check contract normalizes through result helper', () => {
    const result = applyContractResult({ check: () => false }, {});

    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('POTENTIA_CONTRACT_FAILED');
    expect(result.error.message).toBe('Contract failed');
  });

  test('adapter returns deterministic normalized shape', () => {
    const adapter = normalizeContract({ parse: (value) => value, check: () => true });

    expect(Object.keys(adapter)).toEqual(['kind', 'source', 'parse', 'project', 'describe']);
    expect(adapter.kind).toBe('generic-parse');
    expect(typeof adapter.parse).toBe('function');
    expect(typeof adapter.project).toBe('function');
    expect(typeof adapter.describe).toBe('function');
    expect(adapter.project()).toEqual({ kind: 'generic-parse', capabilities: ['parse', 'check'] });
  });
});
