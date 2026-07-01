import { describe, expect, test } from 'bun:test';

import { parseUrlEncodedActionInput } from '../src/kernel/action.js';

describe('kernel action URL-encoded parser', () => {
  test('scalar fields parse', () => {
    expect(parseUrlEncodedActionInput('name=Ada&email=ada%40example.com')).toEqual({ name: 'Ada', email: 'ada@example.com' });
  });

  test('repeated fields become arrays', () => {
    expect(parseUrlEncodedActionInput('tag=a&tag=b')).toEqual({ tag: ['a', 'b'] });
  });

  test('empty field value is preserved', () => {
    expect(parseUrlEncodedActionInput('name=&email=a%40example.com')).toEqual({ name: '', email: 'a@example.com' });
  });

  test('plus sign decodes to space', () => {
    expect(parseUrlEncodedActionInput('name=Ada+Lovelace')).toEqual({ name: 'Ada Lovelace' });
  });

  test('percent encoding works', () => {
    expect(parseUrlEncodedActionInput('city=S%C3%A3o+Paulo')).toEqual({ city: 'São Paulo' });
  });

  test('malformed encoding fails safely', () => {
    expect(() => parseUrlEncodedActionInput('name=%E0%A4%A')).toThrow('Action form input was malformed.');
  });

  test('dangerous keys do not pollute prototype', () => {
    expect(() => parseUrlEncodedActionInput('__proto__=polluted')).toThrow('Action form input contained an unsafe field name.');
    expect({}.polluted).toBeUndefined();
  });

  test('no type coercion', () => {
    expect(parseUrlEncodedActionInput('count=1&enabled=true&empty=&date=2026-01-01')).toEqual({
      count: '1',
      enabled: 'true',
      empty: '',
      date: '2026-01-01'
    });
  });

  test('deterministic object shape', () => {
    const value = parseUrlEncodedActionInput('name=Ada&tag=a&tag=b');
    expect(Object.getPrototypeOf(value)).toBe(Object.prototype);
    expect(Object.keys(value)).toEqual(['name', 'tag']);
  });
});
