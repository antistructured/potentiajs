import { describe, expect, test } from 'bun:test';
import { sigil } from '@weipertda/sigiljs';

import { projectRoute, route } from '../src/index.js';

describe('kernel route projection', () => {
  test('basic route projection summarizes method and path', () => {
    const projection = projectRoute(route('get', '/users/:id', () => 'ok'));

    expect(projection.kind).toBe('route');
    expect(projection.method).toBe('GET');
    expect(projection.path).toBe('/users/:id');
    expect(projection.contracts).toEqual({
      params: null,
      query: null,
      headers: null,
      body: null,
      response: null
    });
    expect(projection.hooks).toEqual({ beforeRequest: 0, afterResponse: 0, onError: 0 });
  });

  test('route with all contract boundaries projects contracts', () => {
    const projection = projectRoute(route('POST', '/users/:id', () => 'ok', {
      params: { parse: (value) => value },
      query: { check: () => true },
      headers: { parse: (value) => value },
      body: { parse: (value) => value },
      response: { check: () => true }
    }));

    expect(projection.contracts.params.kind).toBe('parse');
    expect(projection.contracts.query.kind).toBe('check');
    expect(projection.contracts.headers.kind).toBe('parse');
    expect(projection.contracts.body.kind).toBe('parse');
    expect(projection.contracts.response.kind).toBe('check');
  });

  test('route with SigilJS contracts composes contract projection', () => {
    const Params = sigil({ id: String });
    const Response = sigil({ id: String, name: String });
    const projection = projectRoute(route('GET', '/users/:id', () => 'ok', {
      params: Params,
      response: Response
    }));

    expect(projection.contracts.params.kind).toBe('sigil');
    expect(projection.contracts.params.fields).toEqual([{ name: 'id', required: true, kind: 'string', fields: null }]);
    expect(projection.contracts.response.required).toEqual(['id', 'name']);
  });

  test('route without contracts uses deterministic null contract values', () => {
    const projection = projectRoute(route('GET', '/', () => 'ok'));

    expect(projection.contracts).toEqual({ params: null, query: null, headers: null, body: null, response: null });
  });

  test('route hooks summarize without executing', () => {
    let ran = false;
    const projected = projectRoute({
      ...route('GET', '/', () => 'ok'),
      hooks: {
        beforeRequest: [() => { ran = true; }],
        afterResponse: [() => { ran = true; }, () => { ran = true; }],
        onError: [() => { ran = true; }]
      }
    });

    expect(ran).toBe(false);
    expect(projected.hooks).toEqual({ beforeRequest: 1, afterResponse: 2, onError: 1 });
  });

  test('invalid route input projects deterministically', () => {
    expect(projectRoute({ nope: true })).toEqual({
      kind: 'unknown-route',
      id: null,
      name: null,
      method: null,
      path: null,
      contracts: { params: null, query: null, headers: null, body: null, response: null },
      hooks: { beforeRequest: 0, afterResponse: 0, onError: 0 },
      action: null,
      source: null,
      meta: null
    });
  });

  test('handler is not executed', () => {
    let ran = false;
    const projection = projectRoute(route('GET', '/', () => {
      ran = true;
      return 'ok';
    }));

    expect(ran).toBe(false);
    expect(projection.kind).toBe('route');
  });

  test('projection shape is deterministic', () => {
    expect(Object.keys(projectRoute(route('GET', '/', () => 'ok')))).toEqual([
      'kind',
      'id',
      'name',
      'method',
      'path',
      'contracts',
      'hooks',
      'action',
      'source',
      'meta'
    ]);
  });
});
