import { fail, normalizeError } from './result.js';

export function json(value, init = {}) {
  return createResponseDescriptor('json', value, init);
}

export function text(value, init = {}) {
  return createResponseDescriptor('text', String(value), init);
}

export function redirect(location, status = 302) {
  return createResponseDescriptor('redirect', null, {
    status: status,
    headers: { location: location }
  });
}

export function toResponse(value) {
  if (value instanceof Response) return value;

  if (isResult(value)) {
    if (value.ok) return toResponse(value.value);
    return errorResponse(value.error);
  }

  if (isResponseDescriptor(value)) {
    return descriptorToResponse(value);
  }

  if (value instanceof Error) {
    return errorResponse(normalizeError(value));
  }

  if (value && typeof value === 'object' && value.name === 'PotentiaError') {
    return errorResponse(normalizeError(value));
  }

  if (value === undefined) {
    return new Response(null, { status: 204 });
  }

  if (value === null) {
    return new Response(null, { status: 204 });
  }

  if (typeof value === 'string') {
    return descriptorToResponse(text(value));
  }

  return descriptorToResponse(json(value));
}

export function errorResponse(error) {
  const normalized = normalizeError(error);
  const body = {
    error: {
      code: normalized.code,
      message: normalized.message
    }
  };

  if (normalized.details && typeof normalized.details === 'object') {
    if (typeof normalized.details.boundary === 'string') {
      body.error.boundary = normalized.details.boundary;
    }
    if (Array.isArray(normalized.details.issues)) {
      body.error.issues = normalized.details.issues;
    }
  }

  return descriptorToResponse(json({
    error: body.error
  }, { status: normalized.status }));
}

export function internalFailure(error) {
  return fail(normalizeError(error));
}

export function isResponseDescriptor(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'response');
}

export function responseBody(value) {
  if (isResult(value)) return responseBody(value.value);
  if (isResponseDescriptor(value)) return value.body;
  return value;
}

export function replaceResponseBody(value, body) {
  if (isResult(value)) {
    return {
      ok: value.ok,
      value: replaceResponseBody(value.value, body),
      error: value.error,
      meta: value.meta
    };
  }

  if (isResponseDescriptor(value)) {
    return {
      kind: value.kind,
      type: value.type,
      body: body,
      status: value.status,
      headers: value.headers
    };
  }

  return body;
}

function createResponseDescriptor(type, body, init) {
  const headers = new Headers(init.headers || {});
  const status = init.status || (type === 'redirect' ? 302 : 200);

  return {
    kind: 'response',
    type: type,
    body: body,
    status: status,
    headers: headers
  };
}

function descriptorToResponse(descriptor) {
  const headers = new Headers(descriptor.headers);

  if (descriptor.type === 'json') {
    if (!headers.has('content-type')) headers.set('content-type', 'application/json');
    return new Response(JSON.stringify(descriptor.body), {
      status: descriptor.status,
      headers: headers
    });
  }

  if (descriptor.type === 'text') {
    if (!headers.has('content-type')) headers.set('content-type', 'text/plain; charset=utf-8');
    return new Response(descriptor.body, {
      status: descriptor.status,
      headers: headers
    });
  }

  if (descriptor.type === 'redirect') {
    return new Response(null, {
      status: descriptor.status,
      headers: headers
    });
  }

  return new Response(String(descriptor.body), {
    status: descriptor.status,
    headers: headers
  });
}

function isResult(value) {
  return Boolean(value && typeof value === 'object' && typeof value.ok === 'boolean' && 'value' in value && 'error' in value && 'meta' in value);
}
