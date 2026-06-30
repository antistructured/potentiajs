import { describe, expect, test } from 'bun:test';

import { projectContract } from '../src/index.js';

describe('kernel contract projection shape upgrade', () => {
  test('function contract projection is opaque and parse-capable', () => {
    const projection = projectContract(() => ({ ok: true }));

    expect(projection).toEqual({
      kind: 'function',
      capabilities: ['parse'],
      capability: { parse: true, check: false, project: false },
      opaque: true,
      schema: null,
      fields: null,
      required: null,
      optional: null,
      meta: null
    });
  });

  test('parse contract projection is opaque and parse-capable', () => {
    const projection = projectContract({ parse: (value) => value });

    expect(projection).toEqual({
      kind: 'parse',
      capabilities: ['parse'],
      capability: { parse: true, check: false, project: false },
      opaque: true,
      schema: null,
      fields: null,
      required: null,
      optional: null,
      meta: null
    });
  });

  test('check contract projection is opaque and check-capable', () => {
    const projection = projectContract({ check: () => true });

    expect(projection).toEqual({
      kind: 'check',
      capabilities: ['check'],
      capability: { parse: false, check: true, project: false },
      opaque: true,
      schema: null,
      fields: null,
      required: null,
      optional: null,
      meta: null
    });
  });

  test('missing contract projection is deterministic', () => {
    expect(projectContract()).toEqual({
      kind: 'none',
      capabilities: [],
      capability: { parse: false, check: false, project: false },
      opaque: true,
      schema: null,
      fields: null,
      required: null,
      optional: null,
      meta: null
    });
  });

  test('invalid contract projection is deterministic', () => {
    expect(projectContract({ nope: true })).toEqual({
      kind: 'unknown',
      capabilities: [],
      capability: { parse: false, check: false, project: false },
      opaque: true,
      schema: null,
      fields: null,
      required: null,
      optional: null,
      meta: null
    });
  });

  test('projection does not execute function contract', () => {
    let ran = false;
    const projection = projectContract(() => {
      ran = true;
      return true;
    });

    expect(ran).toBe(false);
    expect(projection.kind).toBe('function');
  });

  test('projection shape is deterministic', () => {
    expect(Object.keys(projectContract({ check: () => true }))).toEqual([
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
