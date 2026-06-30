import { describe, expect, test } from 'bun:test';
import { optional, sigil } from '@weipertda/sigiljs';

import { projectContract } from '../src/index.js';

describe('kernel SigilJS contract projection', () => {
  test('SigilJS object contract projects as non-opaque with schema metadata', () => {
    const Contract = sigil({ id: String, name: String });
    const projection = projectContract(Contract);

    expect(projection.kind).toBe('sigil');
    expect(projection.opaque).toBe(false);
    expect(projection.capability).toEqual({ parse: true, check: true, project: true });
    expect(projection.schema).toMatchObject({
      type: 'object',
      properties: {
        id: { type: 'string' },
        name: { type: 'string' }
      },
      required: ['id', 'name']
    });
  });

  test('field names and primitive kinds project when available', () => {
    const projection = projectContract(sigil({ id: String, count: Number, active: Boolean }));

    expect(projection.fields).toEqual([
      { name: 'id', required: true, kind: 'string', fields: null },
      { name: 'count', required: true, kind: 'number', fields: null },
      { name: 'active', required: true, kind: 'boolean', fields: null }
    ]);
  });

  test('required and optional fields project when available', () => {
    const projection = projectContract(sigil({ id: String, name: optional(String) }));

    expect(projection.required).toEqual(['id']);
    expect(projection.optional).toEqual(['name']);
    expect(projection.fields).toEqual([
      { name: 'id', required: true, kind: 'string', fields: null },
      { name: 'name', required: false, kind: 'string', fields: null }
    ]);
  });

  test('nested shape summary projects safely', () => {
    const projection = projectContract(sigil({ nested: sigil({ ok: Boolean }) }));

    expect(projection.fields).toEqual([
      {
        name: 'nested',
        required: true,
        kind: 'object',
        fields: [{ name: 'ok', required: true, kind: 'boolean', fields: null }]
      }
    ]);
  });

  test('projection is deterministic', () => {
    const Contract = sigil({ id: String, name: optional(String) });

    expect(projectContract(Contract)).toEqual(projectContract(Contract));
  });

  test('unsupported SigilJS metadata falls back safely', () => {
    const Contract = sigil(String);
    const projection = projectContract(Contract);

    expect(projection.kind).toBe('sigil');
    expect(projection.opaque).toBe(false);
    expect(projection.schema).toEqual({ type: 'string' });
    expect(projection.fields).toBe(null);
    expect(projection.required).toBe(null);
    expect(projection.optional).toBe(null);
  });
});
