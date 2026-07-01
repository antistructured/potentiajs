import { createRootIssue, normalizeIssue } from './diagnostics.js';

const DEFAULT_ROOT_KEY = '_form';
const DEFAULT_SENSITIVE_FIELDS = new Set([
  'password',
  'confirmpassword',
  'currentpassword',
  'newpassword',
  'token',
  'secret',
  'apikey',
  'authorization',
  'auth',
  'credential',
  'session',
  'cookie'
]);
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function createFormState(input = {}) {
  const normalizedInput = isPlainObject(input) ? input : {};
  const ok = Object.prototype.hasOwnProperty.call(normalizedInput, 'ok') ? Boolean(normalizedInput.ok) : false;
  const error = normalizeFormError(normalizedInput.error, ok);
  const issues = normalizeFormIssues(normalizedInput.issues, ok, error);

  return {
    ok: ok,
    kind: 'form',
    values: preserveFormValues(normalizedInput.values),
    errors: groupIssuesByField(issues),
    issues: issues,
    error: error,
    value: Object.prototype.hasOwnProperty.call(normalizedInput, 'value') ? normalizedInput.value : null,
    meta: Object.prototype.hasOwnProperty.call(normalizedInput, 'meta') ? normalizedInput.meta : null
  };
}

export function preserveFormValues(input, options = {}) {
  if (!isPlainObject(input)) return {};

  const sensitiveFields = createSensitiveSet(options.sensitiveFields);
  const result = {};

  for (const key of Object.keys(input)) {
    if (!isSafeKey(key) || isSensitiveSegment(key, sensitiveFields)) continue;

    const value = preserveValue(input[key], [key], sensitiveFields, new Set());
    if (value !== undefined) result[key] = value;
  }

  return result;
}

export function groupIssuesByField(issues, options = {}) {
  if (!Array.isArray(issues) || issues.length === 0) return {};

  const rootKey = typeof options.rootKey === 'string' && options.rootKey.length > 0 ? options.rootKey : DEFAULT_ROOT_KEY;
  const errors = {};

  for (const issue of issues) {
    const key = issue && typeof issue === 'object' && typeof issue.field === 'string' && issue.field.length > 0 ? issue.field : rootKey;
    if (!Array.isArray(errors[key])) errors[key] = [];
    errors[key].push(issue);
  }

  return errors;
}

function normalizeFormIssues(issues, ok, error) {
  if (Array.isArray(issues) && issues.length > 0) {
    return issues.map((issue) => normalizeIssue(issue, { boundary: 'input', source: 'framework' }));
  }

  if (!ok && error) {
    return [createRootIssue({
      code: error.code || 'form_failed',
      message: error.message || 'Form submission failed',
      boundary: 'handler',
      source: 'framework'
    })];
  }

  return [];
}

function normalizeFormError(error, ok) {
  if (ok && !error) return null;
  if (!error || typeof error !== 'object') {
    return ok ? null : { code: 'FORM_FAILED', message: 'Form submission failed' };
  }

  return {
    code: typeof error.code === 'string' && error.code.length > 0 ? error.code : 'FORM_FAILED',
    message: typeof error.message === 'string' && error.message.length > 0 ? error.message : 'Form submission failed'
  };
}

function preserveValue(value, path, sensitiveFields, seen) {
  if (isSensitivePath(path, sensitiveFields)) return undefined;
  if (value === null) return null;

  const type = typeof value;
  if (type === 'string' || type === 'number' || type === 'boolean') return value;
  if (type === 'function' || type === 'symbol' || type === 'bigint' || type === 'undefined') return undefined;

  if (Array.isArray(value)) {
    const preserved = [];
    for (let index = 0; index < value.length; index += 1) {
      const item = preserveValue(value[index], path.concat(index), sensitiveFields, seen);
      if (item !== undefined && isSafeArrayValue(item)) preserved.push(item);
    }
    return preserved;
  }

  if (!isPlainObject(value)) return undefined;
  if (seen.has(value)) return undefined;

  seen.add(value);
  const result = {};
  for (const key of Object.keys(value)) {
    if (!isSafeKey(key) || isSensitiveSegment(key, sensitiveFields)) continue;
    const preserved = preserveValue(value[key], path.concat(key), sensitiveFields, seen);
    if (preserved !== undefined) result[key] = preserved;
  }
  seen.delete(value);

  return result;
}

function isSafeArrayValue(value) {
  if (value === null) return true;
  if (Array.isArray(value)) return value.every(isSafeArrayValue);
  if (isPlainObject(value)) return true;
  const type = typeof value;
  return type === 'string' || type === 'number' || type === 'boolean';
}

function createSensitiveSet(extra = []) {
  const fields = new Set(DEFAULT_SENSITIVE_FIELDS);
  if (Array.isArray(extra)) {
    for (const field of extra) {
      if (typeof field === 'string' && field.length > 0) fields.add(normalizeFieldName(field));
    }
  }
  return fields;
}

function isSensitivePath(path, sensitiveFields) {
  return path.some((segment) => typeof segment === 'string' && isSensitiveSegment(segment, sensitiveFields));
}

function isSensitiveSegment(segment, sensitiveFields) {
  const normalized = normalizeFieldName(segment);
  if (sensitiveFields.has(normalized)) return true;
  for (const field of sensitiveFields) {
    if (normalized.includes(field)) return true;
  }
  return false;
}

function normalizeFieldName(value) {
  return String(value).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}

function isSafeKey(key) {
  return typeof key === 'string' && key.length > 0 && !DANGEROUS_KEYS.has(key);
}

function isPlainObject(value) {
  if (!value || typeof value !== 'object') return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
