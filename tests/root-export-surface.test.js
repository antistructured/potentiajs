import { describe, expect, test } from 'bun:test';

import * as api from '../src/index.js';

const previewCore = [
  'createApp',
  'route',
  'createRoutes',
  'mount',
  'action',
  'ok',
  'fail',
  'json',
  'text',
  'redirect',
  'effect',
  'call',
  'value',
  'context',
  'createFormState'
];

const previewAdvanced = [
  'composeRoutes',
  'createPlugin'
];

const previewProjection = [
  'projectContract',
  'projectRoute',
  'projectRoutes',
  'projectAction',
  'projectForm',
  'createRouteManifest'
];

const previewDiagnostic = [
  'createFrameworkError'
];

const internalOnly = [
  'createRequestContext',
  'runEffect',
  'normalizeFrameworkError',
  'toResponse'
];

const expected = [
  ...previewCore,
  ...previewAdvanced,
  ...previewProjection,
  ...previewDiagnostic
].sort();

describe('root export surface', () => {
  test('exports intended public preview surface only', () => {
    expect(Object.keys(api).sort()).toEqual(expected);
  });

  test('preview core exports exist', () => {
    for (const name of previewCore) {
      expect(typeof api[name]).toBe('function');
    }
  });

  test('preview advanced exports exist', () => {
    for (const name of previewAdvanced) {
      expect(typeof api[name]).toBe('function');
    }
  });

  test('preview projection exports exist', () => {
    for (const name of previewProjection) {
      expect(typeof api[name]).toBe('function');
    }
  });

  test('preview diagnostic exports exist', () => {
    for (const name of previewDiagnostic) {
      expect(typeof api[name]).toBe('function');
    }
  });

  test('internal candidates are not root exports', () => {
    for (const name of internalOnly) {
      expect(Object.prototype.hasOwnProperty.call(api, name)).toBe(false);
    }
  });
});
