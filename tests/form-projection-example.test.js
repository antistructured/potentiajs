import { describe, expect, test } from 'bun:test';

import { formProjection } from '../examples/form-state-basic/index.js';

describe('form projection example metadata', () => {
  test('example projection includes expected field names', () => {
    expect(formProjection.fields.map((field) => field.name)).toEqual(['name', 'email', 'password', 'phone']);
  });

  test('password field projects sensitive', () => {
    const password = formProjection.fields.find((field) => field.name === 'password');

    expect(password.sensitive).toBe(true);
    expect(password.input.type).toBe('password');
  });

  test('input hints are correct', () => {
    const byName = Object.fromEntries(formProjection.fields.map((field) => [field.name, field]));

    expect(byName.name.input).toEqual({ type: 'text', mode: null, autocomplete: 'name' });
    expect(byName.email.input).toEqual({ type: 'email', mode: null, autocomplete: 'email' });
    expect(byName.phone.input).toEqual({ type: 'tel', mode: null, autocomplete: 'tel' });
  });

  test('projection is metadata only and renders no HTML', () => {
    expect(formProjection.kind).toBe('form');
    expect(JSON.stringify(formProjection)).not.toContain('<form');
    expect(JSON.stringify(formProjection)).not.toContain('<input');
  });
});
