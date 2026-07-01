const KNOWN_SOURCES = new Set(['sigil', 'generic', 'framework', 'unknown']);
const KNOWN_BOUNDARIES = new Set(['params', 'query', 'headers', 'body', 'response', 'input', 'output', 'handler', 'contract']);
const SAFE_TYPE_DESCRIPTORS = new Set(['string', 'number', 'boolean', 'null', 'undefined', 'array', 'object', 'function', 'symbol', 'bigint']);

export function normalizeIssue(input = null, options = {}) {
  if (!input || typeof input !== 'object') {
    return createRootIssue(options);
  }

  const path = normalizePath(input.path);

  return {
    code: safeString(input.code) || safeString(options.code) || 'contract_failed',
    message: safeString(input.message) || safeString(options.message) || 'Contract rejected value',
    path: path,
    field: deriveField(path),
    boundary: normalizeBoundary(input.boundary, options.boundary),
    source: normalizeSource(input.source, options.source),
    expected: safeExpected(Object.prototype.hasOwnProperty.call(input, 'expected') ? input.expected : options.expected),
    received: safeReceived(Object.prototype.hasOwnProperty.call(input, 'received') ? input.received : options.received),
    meta: null
  };
}

export function normalizeIssues(input = null, options = {}) {
  const rawIssues = Array.isArray(input) && input.length > 0 ? input : [input];
  return rawIssues.map((issue) => normalizeIssue(issue, options)).sort(compareIssues);
}

export function createRootIssue(options = {}) {
  return {
    code: safeString(options.code) || 'contract_failed',
    message: safeString(options.message) || 'Contract rejected value',
    path: [],
    field: null,
    boundary: normalizeBoundary(options.boundary),
    source: normalizeSource(options.source),
    expected: safeExpected(options.expected),
    received: safeReceived(options.received),
    meta: null
  };
}

export function deriveField(path) {
  const normalized = normalizePath(path);
  if (normalized.length === 0) return null;

  let field = '';
  for (const segment of normalized) {
    if (typeof segment === 'number') {
      field += `[${segment}]`;
      continue;
    }

    field += field.length === 0 ? segment : `.${segment}`;
  }

  return field || null;
}

export function normalizePath(path) {
  if (!Array.isArray(path)) return [];

  return path.filter((segment) => {
    if (typeof segment === 'string') return segment.length > 0;
    if (typeof segment === 'number') return Number.isInteger(segment) && segment >= 0;
    return false;
  });
}

export function safeReceived(value) {
  if (value === undefined) return null;
  if (value === null) return 'null';

  if (typeof value === 'string') {
    return SAFE_TYPE_DESCRIPTORS.has(value) ? value : primitiveType(value);
  }

  return primitiveType(value);
}

export function safeExpected(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === 'string') return value.length > 0 && value.length <= 80 ? value : null;
  if (typeof value === 'function' && typeof value.name === 'string' && value.name.length > 0) return value.name.toLowerCase();
  return SAFE_TYPE_DESCRIPTORS.has(primitiveType(value)) ? primitiveType(value) : null;
}

export function sigilIssueFromError(error, boundary) {
  if (!error || typeof error !== 'object' || error.code !== 'SIGIL_VALIDATION_FAILED') {
    return createRootIssue({ boundary: boundary, source: 'sigil' });
  }

  const received = Object.prototype.hasOwnProperty.call(error, 'actual') ? safeReceived(error.actual) : null;
  const expected = safeExpected(error.expected);
  const code = expected && received === 'undefined' ? 'missing_required' : expected && received ? 'invalid_type' : 'contract_failed';

  return normalizeIssue({
    code: code,
    message: 'SigilJS contract rejected value',
    path: error.path,
    boundary: boundary,
    source: 'sigil',
    expected: expected,
    ...(received === null ? {} : { received: received })
  }, { boundary: boundary, source: 'sigil' });
}

function normalizeBoundary(value, fallback = null) {
  const boundary = safeString(value) || safeString(fallback) || 'contract';
  return KNOWN_BOUNDARIES.has(boundary) ? boundary : 'contract';
}

function normalizeSource(value, fallback = null) {
  const source = safeString(value) || safeString(fallback) || 'generic';
  return KNOWN_SOURCES.has(source) ? source : 'unknown';
}

function safeString(value) {
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function primitiveType(value) {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function compareIssues(left, right) {
  const path = comparePaths(left.path, right.path);
  if (path !== 0) return path;
  const code = left.code.localeCompare(right.code);
  if (code !== 0) return code;
  return left.message.localeCompare(right.message);
}

function comparePaths(left, right) {
  if (left.length !== right.length) return left.length - right.length;
  for (let index = 0; index < left.length; index += 1) {
    const a = left[index];
    const b = right[index];
    if (typeof a === 'number' && typeof b === 'number' && a !== b) return a - b;
    const compared = String(a).localeCompare(String(b));
    if (compared !== 0) return compared;
  }
  return 0;
}
