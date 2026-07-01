import { describe, expect, test } from 'bun:test';

import { createFieldProjection } from '../src/kernel/form-projection.js';

describe('kernel form field projection utility', () => {
  test('string field projects text input', () => {
    expect(createFieldProjection({ name: 'title', kind: 'string', required: true })).toMatchObject({ input: { type: 'text', mode: null, autocomplete: null } });
  });

  test('email name projects email input', () => {
    expect(createFieldProjection({ name: 'email', kind: 'string' }).input).toEqual({ type: 'email', mode: null, autocomplete: 'email' });
  });

  test('url and website names project url input', () => {
    expect(createFieldProjection({ name: 'url', kind: 'string' }).input.type).toBe('url');
    expect(createFieldProjection({ name: 'website', kind: 'string' }).input.type).toBe('url');
  });

  test('phone and tel names project tel input', () => {
    expect(createFieldProjection({ name: 'phone', kind: 'string' }).input).toEqual({ type: 'tel', mode: null, autocomplete: 'tel' });
    expect(createFieldProjection({ name: 'tel', kind: 'string' }).input.type).toBe('tel');
  });

  test('password name projects password input and sensitive flag', () => {
    const field = createFieldProjection({ name: 'password', kind: 'string' });

    expect(field.input.type).toBe('password');
    expect(field.sensitive).toBe(true);
  });

  test('token secret and apiKey are sensitive', () => {
    expect(createFieldProjection({ name: 'token', kind: 'string' }).sensitive).toBe(true);
    expect(createFieldProjection({ name: 'secret', kind: 'string' }).sensitive).toBe(true);
    expect(createFieldProjection({ name: 'apiKey', kind: 'string' }).sensitive).toBe(true);
  });

  test('number projects number input', () => {
    expect(createFieldProjection({ name: 'count', kind: 'number' }).input.type).toBe('number');
  });

  test('boolean projects checkbox input', () => {
    expect(createFieldProjection({ name: 'active', kind: 'boolean' }).input.type).toBe('checkbox');
  });

  test('scalar array projects multiple text field', () => {
    const field = createFieldProjection({ name: 'tags', kind: 'array' });

    expect(field.input.type).toBe('text');
    expect(field.multiple).toBe(true);
  });

  test('nested path derives field name and label', () => {
    const field = createFieldProjection({ path: ['profile', 'name'], kind: 'string' });

    expect(field.name).toBe('profile.name');
    expect(field.field).toBe('profile.name');
    expect(field.label).toBe('Profile Name');
  });

  test('default metadata is null and shape is deterministic', () => {
    expect(createFieldProjection({ name: 'email', kind: 'string', required: true })).toEqual({
      kind: 'field',
      name: 'email',
      path: ['email'],
      field: 'email',
      label: 'Email',
      help: null,
      placeholder: null,
      input: { type: 'email', mode: null, autocomplete: 'email' },
      required: true,
      multiple: false,
      sensitive: false,
      options: null,
      defaultValue: null,
      contract: { kind: 'unknown', expected: 'string' },
      meta: null
    });
  });
});
