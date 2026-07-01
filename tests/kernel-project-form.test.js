import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { action, projectForm } from '../src/index.js';

describe('kernel projectForm', () => {
  test('projectForm(action) returns form metadata', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }));

    expect(form.kind).toBe('form');
    expect(form.opaque).toBe(false);
    expect(form.fields).toHaveLength(1);
  });

  test('form id and actionId come from action id', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }));

    expect(form.id).toBe('users.create');
    expect(form.actionId).toBe('users.create');
  });

  test('default method and encType are form-post friendly', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }));

    expect(form.method).toBe('POST');
    expect(form.encType).toBe('application/x-www-form-urlencoded');
  });

  test('options can override id method and encType', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }), { id: 'custom.form', method: 'PUT', encType: 'application/json' });

    expect(form.id).toBe('custom.form');
    expect(form.method).toBe('PUT');
    expect(form.encType).toBe('application/json');
  });

  test('SigilJS input contract projects fields', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String, password: String }) }));

    expect(form.fields.map((field) => [field.name, field.input.type, field.sensitive])).toEqual([
      ['email', 'email', false],
      ['password', 'password', true]
    ]);
  });

  test('opaque generic input contract returns opaque form', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: { check: () => true } }));

    expect(form.opaque).toBe(true);
    expect(form.fields).toBe(null);
    expect(form.reason).toBe('Action input contract is opaque');
  });

  test('meta carries through', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }), meta: { description: 'Create user' } }));

    expect(form.meta).toEqual({ description: 'Create user' });
  });

  test('handler is not executed', () => {
    let ran = false;
    projectForm(action('users.create', () => { ran = true; return 'ok'; }, { input: sigil({ email: String }) }));

    expect(ran).toBe(false);
  });

  test('contract validation is not executed', () => {
    let ran = false;
    projectForm(action('users.create', () => 'ok', { input: () => { ran = true; return true; } }));

    expect(ran).toBe(false);
  });

  test('shape is deterministic', () => {
    const createUser = action('users.create', () => 'ok', { input: sigil({ email: String }) });

    expect(projectForm(createUser)).toEqual(projectForm(createUser));
  });

  test('projectForm is exported from root package', async () => {
    const api = await import('../src/index.js');

    expect(typeof api.projectForm).toBe('function');
  });
});
