import { applyContract, createContractFailure } from './contract.js';
import { createRootIssue } from './diagnostics.js';
import { createFrameworkError, ERROR_CODES } from './error.js';
import { runEffect } from './effect.js';
import { fail } from './result.js';
import { normalizeSource } from './route.js';
import { isRedirectResponse, replaceResponseBody, responseBody } from './response.js';

export function action(id, handler, options = {}) {
  if (typeof id !== 'string' || id.length === 0) {
    throw new TypeError('Action id must be a non-empty string');
  }

  if (!isRunnableHandler(handler)) {
    throw new TypeError('Action handler must be a function or effect descriptor');
  }

  return {
    kind: 'action',
    id: id,
    handler: handler,
    input: Object.prototype.hasOwnProperty.call(options, 'input') ? options.input : null,
    output: Object.prototype.hasOwnProperty.call(options, 'output') ? options.output : null,
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null,
    source: normalizeSource(options.source)
  };
}

export function isAction(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'action' && typeof value.id === 'string' && Object.prototype.hasOwnProperty.call(value, 'handler'));
}

export async function runAction(actionValue, context, options = {}) {
  const input = await parseActionInput(context.request);

  if (options.routeOptions && options.routeOptions.body) {
    context.body = applyActionContract(options.routeOptions.body, input, 'body', 'Request body failed contract validation', ERROR_CODES.CONTRACT_FAILED, 400);
  }

  context.input = actionValue.input ? applyActionContract(actionValue.input, input, 'input', 'Action input contract failed.', ERROR_CODES.ACTION_INPUT_FAILED, 400) : input;

  let value;
  try {
    value = await runEffect(actionValue.handler, context);
  } catch (error) {
    throw createFrameworkError(ERROR_CODES.ACTION_HANDLER_FAILED, 'Internal server error', {
      status: 500,
      detail: { boundary: 'handler', issues: [createRootIssue({ code: 'handler_failed', message: 'Handler failed', boundary: 'handler', source: 'framework' })] },
      cause: error,
      expose: false
    });
  }

  if (!actionValue.output || value instanceof Response || isRedirectResponse(value) || isFailureResult(value)) return value;

  try {
    const body = responseBody(value);
    const output = applyContract(actionValue.output, body, { boundary: 'output' });
    return replaceResponseBody(value, output);
  } catch (error) {
    return fail(createContractFailure('output', 'Action output contract failed.', error, {
      code: ERROR_CODES.ACTION_OUTPUT_FAILED,
      status: 500
    }));
  }
}

async function parseActionInput(request) {
  let text;
  try {
    text = await request.text();
  } catch (error) {
    throw createActionInputFailure('Action input could not be read.', error);
  }

  if (text.length === 0) return null;

  const contentType = detectActionContentType(request.headers.get('content-type'));

  if (contentType === 'form-urlencoded') {
    return parseUrlEncodedActionInput(text);
  }

  if (contentType === 'unsupported') {
    throw createActionInputFailure('Action input content type is unsupported.', null);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw createActionInputFailure('Action input JSON was malformed.', error);
  }
}

export function detectActionContentType(value) {
  if (typeof value !== 'string' || value.trim().length === 0) return 'missing';

  const mediaType = value.toLowerCase().split(';')[0].trim();
  if (mediaType === 'application/json') return 'json';
  if (mediaType === 'application/x-www-form-urlencoded') return 'form-urlencoded';
  return 'unsupported';
}

export function parseUrlEncodedActionInput(text) {
  const result = {};

  for (const pair of text.split('&')) {
    if (pair.length === 0) continue;

    const separator = pair.indexOf('=');
    const rawKey = separator === -1 ? pair : pair.slice(0, separator);
    const rawValue = separator === -1 ? '' : pair.slice(separator + 1);
    const key = decodeUrlEncodedPart(rawKey);
    const value = decodeUrlEncodedPart(rawValue);

    if (isDangerousFormKey(key)) {
      throw createActionInputFailure('Action form input contained an unsafe field name.', null);
    }

    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const current = result[key];
      result[key] = Array.isArray(current) ? current.concat(value) : [current, value];
    } else {
      result[key] = value;
    }
  }

  return result;
}

function decodeUrlEncodedPart(value) {
  try {
    return decodeURIComponent(value.replace(/\+/g, ' '));
  } catch (error) {
    throw createActionInputFailure('Action form input was malformed.', error);
  }
}

function isDangerousFormKey(key) {
  return key === '__proto__' || key === 'constructor' || key === 'prototype';
}

function isFailureResult(value) {
  return Boolean(value && typeof value === 'object' && value.ok === false && 'value' in value && 'error' in value && 'meta' in value);
}

function applyActionContract(contract, value, boundary, message, code, status) {
  try {
    return applyContract(contract, value, { boundary: boundary });
  } catch (error) {
    throw createContractFailure(boundary, message, error, { code: code, status: status });
  }
}

function createActionInputFailure(message, cause) {
  return createFrameworkError(ERROR_CODES.ACTION_INPUT_FAILED, message, {
    status: 400,
    detail: { boundary: 'input', issues: [createRootIssue({ code: actionInputIssueCode(message), message: message, boundary: 'input', source: 'framework' })] },
    cause: cause,
    expose: true
  });
}

function actionInputIssueCode(message) {
  if (message.includes('malformed')) return 'malformed_input';
  if (message.includes('unsupported')) return 'unsupported_content_type';
  return 'input_failed';
}

function isRunnableHandler(handler) {
  return typeof handler === 'function' || Boolean(handler && typeof handler === 'object' && handler.type === 'effect' && typeof handler.run === 'function');
}
