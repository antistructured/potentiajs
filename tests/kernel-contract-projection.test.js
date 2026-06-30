import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { projectContract } from '../src/index.js';

describe('kernel contract projection', () => {
  test('function contract projection is honest', () => {
    const projection = projectContract(() => ({ ok: true }));

    expect(projection).toMatchObject({ kind: 'function', capabilities: ['parse'], schema: null, opaque: true });
  });

  test('parse contract projection is parse-capable', () => {
    const projection = projectContract({ parse: (value) => value });

    expect(projection).toMatchObject({ kind: 'parse', capabilities: ['parse'], schema: null, opaque: true });
  });

  test('check contract projection is check-capable', () => {
    const projection = projectContract({ check: () => true });

    expect(projection).toMatchObject({ kind: 'check', capabilities: ['check'], schema: null, opaque: true });
  });

  test('SigilJS contract projection uses safe metadata', () => {
    const Contract = sigil({ id: String, name: String });
    const projection = projectContract(Contract);

    expect(projection.kind).toBe('sigil');
    expect(projection.capabilities).toEqual(['parse', 'check', 'project']);
    expect(projection.opaque).toBe(false);
    expect(projection.schema.type).toBe('object');
    expect(Object.keys(projection.schema.properties)).toEqual(['id', 'name']);
  });

  test('projection does not execute contract logic', () => {
    let ran = false;
    const projection = projectContract({
      parse(value) {
        ran = true;
        return value;
      }
    });

    expect(ran).toBe(false);
    expect(projection.kind).toBe('parse');
  });

  test('projection has deterministic shape', () => {
    const projection = projectContract({ check: () => true });

    expect(Object.keys(projection)).toEqual([
      'kind',
      'capabilities',
      'capability',
      'opaque',
      'schema',
      'fields',
      'required',
      'optional',
      'meta'
    ]);
  });
});
