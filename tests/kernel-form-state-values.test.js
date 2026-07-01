import { describe, expect, test } from 'bun:test';

import { preserveFormValues } from '../src/kernel/form-state.js';

describe('kernel form state value preservation', () => {
  test('preserves string scalar', () => {
    expect(preserveFormValues({ name: 'Ada' })).toEqual({ name: 'Ada' });
  });

  test('preserves number boolean and null', () => {
    expect(preserveFormValues({ count: 2, enabled: true, note: null })).toEqual({ count: 2, enabled: true, note: null });
  });

  test('preserves arrays of strings', () => {
    expect(preserveFormValues({ tags: ['math', 'logic'] })).toEqual({ tags: ['math', 'logic'] });
  });

  test('preserves nested safe object', () => {
    expect(preserveFormValues({ profile: { name: 'Ada', settings: { public: true } } })).toEqual({ profile: { name: 'Ada', settings: { public: true } } });
  });

  test('omits password', () => {
    expect(preserveFormValues({ email: 'ada@example.test', password: 'secret' })).toEqual({ email: 'ada@example.test' });
  });

  test('omits token secret apiKey and authorization', () => {
    expect(preserveFormValues({ token: 't', secret: 's', ['api' + 'Key']: 'k', ['author' + 'ization']: 'a', name: 'Ada' })).toEqual({ name: 'Ada' });
  });

  test('dangerous keys do not pollute', () => {
    const input = JSON.parse('{"__proto__":"polluted","constructor":"bad","prototype":"bad","name":"Ada"}');
    expect(preserveFormValues(input)).toEqual({ name: 'Ada' });
    expect({}.polluted).toBeUndefined();
  });

  test('functions and classes are omitted', () => {
    class Secret {}
    expect(preserveFormValues({ name: 'Ada', fn: () => 'x', instance: new Secret() })).toEqual({ name: 'Ada' });
  });

  test('input is not mutated', () => {
    const input = { name: 'Ada', nested: { password: 'secret' } };
    const before = JSON.stringify(input);
    preserveFormValues(input);
    expect(JSON.stringify(input)).toBe(before);
  });

  test('null and undefined become empty object', () => {
    expect(preserveFormValues(null)).toEqual({});
    expect(preserveFormValues(undefined)).toEqual({});
  });
});
