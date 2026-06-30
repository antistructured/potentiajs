import { normalizeFrameworkError } from './error.js';

export function ok(value, meta = null) {
  return {
    ok: true,
    value: value,
    error: null,
    meta: meta
  };
}

export function fail(error, meta = null) {
  return {
    ok: false,
    value: null,
    error: normalizeError(error),
    meta: meta
  };
}

export function normalizeError(error) {
  const normalized = normalizeFrameworkError(error);

  return {
    code: normalized.code,
    message: normalized.message,
    status: normalized.status,
    details: normalized.detail
  };
}
