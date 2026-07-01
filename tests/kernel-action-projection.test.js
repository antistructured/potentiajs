import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, createRouteManifest, projectAction, projectRoute, route } from '../src/index.js';

describe('kernel action projection', () => {
  test('action projection includes id', () => {
    const projection = projectAction(action('users.create', () => 'ok'));

    expect(projection.kind).toBe('action');
    expect(projection.id).toBe('users.create');
  });

  test('action projection includes input and output contract projections', () => {
    const Input = sigil({ name: String });
    const Output = sigil({ id: String, name: String });
    const projection = projectAction(action('users.create', () => 'ok', {
      input: Input,
      output: Output
    }));

    expect(projection.input.kind).toBe('sigil');
    expect(projection.input.fields).toEqual([{ name: 'name', required: true, kind: 'string', fields: null }]);
    expect(projection.output.required).toEqual(['id', 'name']);
  });

  test('action projection includes meta and source', () => {
    const projection = projectAction(action('users.create', () => 'ok', {
      meta: { description: 'Create user' },
      source: { file: 'routes/users.js' }
    }));

    expect(projection.meta).toEqual({ description: 'Create user' });
    expect(projection.source).toEqual({ file: 'routes/users.js', line: null, column: null });
  });

  test('action projection does not execute handler or contracts', () => {
    let ran = false;
    const value = action('users.create', () => {
      ran = true;
      return 'ok';
    }, {
      input: { parse: (input) => { ran = true; return input; } },
      output: { parse: (output) => { ran = true; return output; } }
    });

    const projection = projectAction(value);

    expect(ran).toBe(false);
    expect(projection.input.kind).toBe('parse');
    expect(projection.output.kind).toBe('parse');
  });

  test('invalid action input projects deterministically', () => {
    expect(projectAction({ nope: true })).toEqual({
      kind: 'unknown-action',
      id: null,
      input: null,
      output: null,
      result: null,
      source: null,
      meta: null
    });
  });

  test('route projection detects action handlers', () => {
    const projection = projectRoute(route('POST', '/users', action('users.create', () => 'ok')));

    expect(projection.action.id).toBe('users.create');
    expect(projection.action.kind).toBe('action');
  });

  test('manifest includes action metadata', () => {
    const Input = sigil({ name: String });
    const manifest = createRouteManifest([
      route('POST', '/users', action('users.create', () => 'ok', {
        input: Input,
        meta: { description: 'Create user' },
        source: { file: 'routes/users.js' }
      }))
    ]);

    expect(manifest.actions).toHaveLength(1);
    expect(manifest.actions[0].id).toBe('users.create');
    expect(manifest.actions[0].routeId).toBe('POST /users');
    expect(manifest.actions[0].contentTypes).toEqual(['application/json', 'application/x-www-form-urlencoded']);
    expect(manifest.actions[0].enhancement).toEqual({ plainForm: true, fetch: true, clientValidation: 'projection-only' });
    expect(manifest.actions[0].input.fields).toEqual([{ name: 'name', required: true, kind: 'string', fields: null }]);
  });
});
