export const ERROR_CODES = {
  NOT_FOUND: 'POTENTIA_NOT_FOUND',
  METHOD_NOT_ALLOWED: 'POTENTIA_METHOD_NOT_ALLOWED',
  CONTRACT_FAILED: 'POTENTIA_CONTRACT_FAILED',
  RESPONSE_CONTRACT_FAILED: 'POTENTIA_RESPONSE_CONTRACT_FAILED',
  HANDLER_FAILED: 'POTENTIA_HANDLER_FAILED',
  BAD_REQUEST: 'POTENTIA_BAD_REQUEST'
};

export function createFrameworkError(code, message, options = {}) {
  return {
    name: 'PotentiaError',
    code: code,
    message: message,
    status: Number.isInteger(options.status) ? options.status : statusForCode(code),
    detail: Object.prototype.hasOwnProperty.call(options, 'detail') ? options.detail : null,
    cause: Object.prototype.hasOwnProperty.call(options, 'cause') ? options.cause : null,
    expose: Object.prototype.hasOwnProperty.call(options, 'expose') ? Boolean(options.expose) : defaultExpose(code)
  };
}

export function normalizeFrameworkError(error) {
  if (isFrameworkError(error)) {
    return createFrameworkError(error.code, visibleMessage(error), {
      status: error.status,
      detail: error.detail,
      cause: error.cause,
      expose: error.expose
    });
  }

  if (error && typeof error === 'object' && typeof error.code === 'string') {
    const mapped = mapLegacyCode(error.code);
    return createFrameworkError(mapped, error.message || defaultMessage(mapped), {
      status: Number.isInteger(error.status) ? error.status : statusForCode(mapped),
      detail: error.detail ?? error.details ?? null,
      cause: error.cause ?? null,
      expose: error.expose ?? defaultExpose(mapped)
    });
  }

  return createFrameworkError(ERROR_CODES.HANDLER_FAILED, 'Internal server error', {
    status: 500,
    detail: null,
    cause: error,
    expose: false
  });
}

export function isFrameworkError(error) {
  return Boolean(error && typeof error === 'object' && error.name === 'PotentiaError' && typeof error.code === 'string');
}

function visibleMessage(error) {
  return error.expose ? error.message : defaultMessage(error.code);
}

function mapLegacyCode(code) {
  if (code === 'NOT_FOUND') return ERROR_CODES.NOT_FOUND;
  if (code === 'METHOD_NOT_ALLOWED') return ERROR_CODES.METHOD_NOT_ALLOWED;
  if (code === 'BAD_REQUEST') return ERROR_CODES.CONTRACT_FAILED;
  if (code === 'RESPONSE_CONTRACT_FAILED') return ERROR_CODES.RESPONSE_CONTRACT_FAILED;
  if (code === 'ERROR') return ERROR_CODES.HANDLER_FAILED;
  return code.startsWith('POTENTIA_') ? code : ERROR_CODES.HANDLER_FAILED;
}

function statusForCode(code) {
  if (code === ERROR_CODES.NOT_FOUND) return 404;
  if (code === ERROR_CODES.METHOD_NOT_ALLOWED) return 405;
  if (code === ERROR_CODES.CONTRACT_FAILED) return 400;
  if (code === ERROR_CODES.BAD_REQUEST) return 400;
  return 500;
}

function defaultExpose(code) {
  return code !== ERROR_CODES.HANDLER_FAILED;
}

function defaultMessage(code) {
  if (code === ERROR_CODES.NOT_FOUND) return 'No route matched the request path';
  if (code === ERROR_CODES.METHOD_NOT_ALLOWED) return 'Route matched the path, but not the request method';
  if (code === ERROR_CODES.CONTRACT_FAILED) return 'Request failed contract validation';
  if (code === ERROR_CODES.RESPONSE_CONTRACT_FAILED) return 'Response failed contract validation';
  if (code === ERROR_CODES.BAD_REQUEST) return 'Bad request';
  return 'Internal server error';
}
