import { describe, expect, test } from 'bun:test';

import { action, effect, route } from '../src/index.js';

describe('kernel action shape', () => {
  test('action creates deterministic shape', () => {
    const handler = () => 'ok';
    const value = action('users.create', handler);

    expect(Object.keys(value)).toEqual(['kind', 'id', 'handler', 'input', 'output', 'meta', 'source']);
    expect(value).toEqual({
      kind: 'action',
      id: 'users.create',
      handler: handler,
      input: null,
      output: null,
      meta: null,
      source: null
    });
  });

  test('action stores input and output contracts', () => {
    const input = { parse: (value) => value };
    const output = { check: () => true };
    const value = action('users.create', () => 'ok', { input: input, output: output });

    expect(value.input).toBe(input);
    expect(value.output).toBe(output);
  });

  test('action stores meta and normalized source', () => {
    const meta = { description: 'Create user' };
    const value = action('users.create', () => 'ok', {
      meta: meta,
      source: { file: 'routes/users.js' }
    });

    expect(value.meta).toBe(meta);
    expect(value.source).toEqual({ file: 'routes/users.js', line: null, column: null });
  });

  test('action does not execute handler during construction', () => {
    let ran = false;
    const value = action('users.create', () => {
      ran = true;
      return 'ok';
    });

    expect(ran).toBe(false);
    expect(value.handler).toBeFunction();
  });

  test('action can be passed directly to route', () => {
    const createUser = action('users.create', () => 'ok');
    const value = route('POST', '/users', createUser);

    expect(value.handler).toBe(createUser);
    expect(value.handler.kind).toBe('action');
  });

  test('effect action handler is accepted', () => {
    const value = action('users.create', effect(function* createUser() {
      return 'ok';
    }));

    expect(value.handler.type).toBe('effect');
  });

  test('invalid id fails deterministically', () => {
    expect(() => action('', () => 'ok')).toThrow('Action id must be a non-empty string');
    expect(() => action(null, () => 'ok')).toThrow('Action id must be a non-empty string');
  });

  test('invalid handler fails deterministically', () => {
    expect(() => action('users.create', null)).toThrow('Action handler must be a function or effect descriptor');
    expect(() => action('users.create', { nope: true })).toThrow('Action handler must be a function or effect descriptor');
  });
});
