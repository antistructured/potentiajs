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
  const normalizedInput = typeof meta === 'number' && error && typeof error === 'object' ? { ...error, status: meta } : error;

  return {
    ok: false,
    value: null,
    error: normalizeError(normalizedInput),
    meta: typeof meta === 'number' ? null : meta
  };
}

export function normalizeError(error) {
  if (isFormState(error)) {
    return {
      code: error.error.code,
      message: error.error.message,
      status: Number.isInteger(error.status) ? error.status : 400,
      details: error
    };
  }

  const normalized = normalizeFrameworkError(error);

  return {
    code: normalized.code,
    message: normalized.message,
    status: normalized.status,
    details: normalized.detail
  };
}

function isFormState(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'form' && typeof value.ok === 'boolean' && value.error && typeof value.error === 'object' && typeof value.error.code === 'string');
}
