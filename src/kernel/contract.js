import { createFrameworkError, ERROR_CODES } from './error.js';
import { createRootIssue, sigilIssueFromError } from './diagnostics.js';

export function normalizeContract(contract) {
  if (!contract) {
    return createAdapter('none', contract, (value) => value, () => ({ kind: 'none', capabilities: [] }));
  }

  if (typeof contract === 'function') {
    return createAdapter('generic-function', contract, contract, () => ({ kind: 'generic-function', capabilities: ['parse'] }));
  }

  if (isSigilContract(contract)) {
    return createAdapter('sigil', contract, (value) => contract.parse(value), () => projectSigilContract(contract));
  }

  if (contract && typeof contract.parse === 'function') {
    const capabilities = ['parse'];
    if (typeof contract.check === 'function') capabilities.push('check');
    return createAdapter('generic-parse', contract, (value, context) => contract.parse(value, context), () => ({ kind: 'generic-parse', capabilities: capabilities }));
  }

  if (contract && typeof contract.check === 'function') {
    return createAdapter('generic-check', contract, (value, context) => {
      if (!contract.check(value, context)) {
        const error = new Error('Contract check returned false');
        error.code = 'POTENTIA_CONTRACT_CHECK_FALSE';
        throw error;
      }
      return value;
    }, () => ({ kind: 'generic-check', capabilities: ['check'] }));
  }

  return createAdapter('unknown', contract, (value) => value, () => ({ kind: 'unknown', capabilities: [] }));
}

export function applyContract(contract, value, context = {}) {
  const adapter = normalizeContract(contract);
  return adapter.parse(value, context);
}

export function applyContractResult(contract, value, context = {}) {
  try {
    return {
      ok: true,
      value: applyContract(contract, value, context),
      error: null
    };
  } catch (error) {
    return {
      ok: false,
      value: null,
      error: createContractFailure(context.boundary || 'contract', 'Contract failed', error)
    };
  }
}

export async function parseContractBody(request, contract) {
  if (!contract) return null;

  const value = await request.json();
  try {
    return applyContract(contract, value, { boundary: 'body' });
  } catch (error) {
    throw createContractFailure('body', 'Request body failed contract validation', error);
  }
}

export function applyNamedRequestContract(name, contract, value) {
  if (!contract) return value;

  const boundary = name.toLowerCase();
  try {
    return applyContract(contract, value, { boundary: boundary });
  } catch (error) {
    throw createContractFailure(boundary, `${name} failed contract validation`, error);
  }
}

export function createContractFailure(boundary, message, cause, options = {}) {
  return createFrameworkError(options.code || ERROR_CODES.CONTRACT_FAILED, message, {
    status: options.status || 400,
    detail: {
      boundary: boundary,
      issues: safeContractIssues(cause, boundary)
    },
    cause: cause,
    expose: true
  });
}

export function isSigilContract(contract) {
  return Boolean(
    contract &&
    typeof contract === 'object' &&
    typeof contract.parse === 'function' &&
    typeof contract.safeParse === 'function' &&
    typeof contract.toJSONSchema === 'function' &&
    typeof contract.describe === 'function' &&
    Object.prototype.hasOwnProperty.call(contract, 'ast')
  );
}

function createAdapter(kind, source, parse, project) {
  return {
    kind: kind,
    source: source,
    parse: parse,
    project: project,
    describe: function describe() {
      return project();
    }
  };
}

function projectSigilContract(contract) {
  return {
    kind: 'sigil',
    capabilities: ['parse', 'check', 'safeParse', 'describe', 'project'],
    name: typeof contract.name === 'string' ? contract.name : null,
    source: typeof contract.source === 'string' ? contract.source : null
  };
}

function safeContractIssues(cause, boundary) {
  if (cause && typeof cause === 'object' && cause.code === 'SIGIL_VALIDATION_FAILED') {
    return [sigilIssueFromError(cause, boundary)];
  }

  if (cause && typeof cause === 'object' && cause.code === 'POTENTIA_CONTRACT_CHECK_FALSE') {
    return [createRootIssue({ code: 'check_failed', message: 'Contract check returned false', boundary: boundary, source: 'generic' })];
  }

  return [createRootIssue({ code: 'parse_failed', message: 'Contract parser rejected value', boundary: boundary, source: 'generic' })];
}
