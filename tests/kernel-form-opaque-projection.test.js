import { describe, expect, test } from 'bun:test';

import { action, projectContract } from '../src/index.js';
import { projectFieldsFromContractProjection, projectForm } from '../src/kernel/form-projection.js';

describe('kernel form opaque projection', () => {
  test('generic function input contract is opaque', () => {
    const result = projectFieldsFromContractProjection(projectContract(() => true));

    expect(result).toEqual({ opaque: true, fields: null, reason: 'Action input contract is opaque' });
  });

  test('parse contract is opaque', () => {
    const result = projectFieldsFromContractProjection(projectContract({ parse: (value) => value }));

    expect(result).toEqual({ opaque: true, fields: null, reason: 'Action input contract is opaque' });
  });

  test('check contract is opaque', () => {
    const result = projectFieldsFromContractProjection(projectContract({ check: () => true }));

    expect(result).toEqual({ opaque: true, fields: null, reason: 'Action input contract is opaque' });
  });

  test('missing input contract behavior is deterministic', () => {
    const form = projectForm(action('users.create', () => 'ok'));

    expect(form).toMatchObject({ opaque: true, fields: null, reason: 'Action input contract is missing' });
  });

  test('invalid action behavior is deterministic', () => {
    expect(projectForm({ nope: true })).toEqual({
      kind: 'form',
      id: null,
      actionId: null,
      method: 'POST',
      encType: 'application/x-www-form-urlencoded',
      opaque: true,
      fields: null,
      reason: 'Input is not an action',
      errors: { rootKey: '_form' },
      values: { preservation: 'safe-parsed-values' },
      validation: { server: 'authoritative', client: 'projection-only' },
      redirect: { afterPost: 'explicit-303-recommended' },
      meta: null
    });
  });

  test('generic contract is not executed', () => {
    let ran = false;
    projectForm(action('users.create', () => 'ok', { input: () => { ran = true; return true; } }));

    expect(ran).toBe(false);
  });

  test('opaque output shape is stable', () => {
    expect(Object.keys(projectForm(action('users.create', () => 'ok', { input: { check: () => true } })))).toEqual([
      'kind',
      'id',
      'actionId',
      'method',
      'encType',
      'opaque',
      'fields',
      'reason',
      'errors',
      'values',
      'validation',
      'redirect',
      'meta'
    ]);
  });
});
