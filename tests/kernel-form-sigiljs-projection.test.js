import { describe, expect, test } from 'bun:test';
import { optional, sigil } from '@weipertda/sigiljs';

import { projectContract } from '../src/index.js';
import { projectFieldsFromContractProjection } from '../src/kernel/form-projection.js';

describe('kernel form SigilJS field projection', () => {
  test('simple SigilJS object projects fields', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ email: String, count: Number, active: Boolean })));

    expect(result.opaque).toBe(false);
    expect(result.fields.map((field) => [field.name, field.input.type])).toEqual([
      ['email', 'email'],
      ['count', 'number'],
      ['active', 'checkbox']
    ]);
  });

  test('required fields project', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ email: String })));

    expect(result.fields[0].required).toBe(true);
  });

  test('optional fields project when metadata is available', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ email: String, name: optional(String) })));

    expect(result.fields.map((field) => [field.name, field.required])).toEqual([
      ['email', true],
      ['name', false]
    ]);
  });

  test('nested object fields flatten', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ profile: sigil({ name: String }) })));

    expect(result.fields).toMatchObject([{ name: 'profile.name', path: ['profile', 'name'], field: 'profile.name', label: 'Profile Name', input: { type: 'text' } }]);
  });

  test('scalar array projects multiple when metadata is available', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ tags: Array })));

    expect(result.fields[0]).toMatchObject({ name: 'tags', multiple: true, input: { type: 'text' }, contract: { kind: 'sigil', expected: 'array' } });
  });

  test('field order is deterministic', () => {
    const Contract = sigil({ email: String, name: String, active: Boolean });

    expect(projectFieldsFromContractProjection(projectContract(Contract))).toEqual(projectFieldsFromContractProjection(projectContract(Contract)));
  });

  test('unknown SigilJS shape falls back honestly', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil(String)));

    expect(result).toEqual({ opaque: true, fields: null, reason: 'Action input contract fields are unavailable' });
  });

  test('projection does not require sample input', () => {
    const result = projectFieldsFromContractProjection(projectContract(sigil({ email: String })));

    expect(result.fields[0].name).toBe('email');
    expect(result.fields[0].defaultValue).toBe(null);
  });
});
