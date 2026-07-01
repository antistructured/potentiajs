import { isAction } from './action.js';
import { projectContract } from './contract-projection.js';

const ROOT_ERROR_KEY = '_form';
const DEFAULT_METHOD = 'POST';
const DEFAULT_ENCTYPE = 'application/x-www-form-urlencoded';
const SENSITIVE_SEGMENTS = new Set([
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

export function projectForm(value, options = {}) {
  if (!isAction(value)) {
    return createFormProjection({
      id: optionString(options.id, null),
      actionId: null,
      method: optionString(options.method, DEFAULT_METHOD),
      encType: optionString(options.encType, DEFAULT_ENCTYPE),
      opaque: true,
      fields: null,
      reason: 'Input is not an action',
      meta: null
    });
  }

  const contractProjection = value.input ? projectContract(value.input) : null;
  const fieldResult = projectFieldsFromContractProjection(contractProjection);

  return createFormProjection({
    id: optionString(options.id, value.id),
    actionId: value.id,
    method: optionString(options.method, DEFAULT_METHOD),
    encType: optionString(options.encType, DEFAULT_ENCTYPE),
    opaque: fieldResult.opaque,
    fields: fieldResult.fields,
    reason: fieldResult.reason,
    meta: value.meta || null
  });
}

export function createFieldProjection(options = {}) {
  const path = Array.isArray(options.path) ? options.path.slice() : fieldPath(options.name || options.field || '');
  const field = typeof options.field === 'string' && options.field.length > 0 ? options.field : pathToField(path);
  const kind = typeof options.kind === 'string' && options.kind.length > 0 ? options.kind : 'unknown';
  const multiple = Object.prototype.hasOwnProperty.call(options, 'multiple') ? Boolean(options.multiple) : kind === 'array';
  const sensitive = isSensitiveField(path.length > 0 ? path : field);
  const input = deriveInputHint({ field: field, path: path, kind: kind, multiple: multiple, sensitive: sensitive });

  return {
    kind: 'field',
    name: typeof options.name === 'string' && options.name.length > 0 ? options.name : field,
    path: path,
    field: field,
    label: typeof options.label === 'string' && options.label.length > 0 ? options.label : deriveLabel(field),
    help: null,
    placeholder: null,
    input: input,
    required: Object.prototype.hasOwnProperty.call(options, 'required') ? Boolean(options.required) : null,
    multiple: multiple,
    sensitive: sensitive,
    options: Array.isArray(options.options) ? options.options : null,
    defaultValue: null,
    contract: {
      kind: typeof options.contractKind === 'string' && options.contractKind.length > 0 ? options.contractKind : 'unknown',
      expected: kind
    },
    meta: null
  };
}

export function deriveLabel(field) {
  if (typeof field !== 'string' || field.length === 0) return '';
  const leaf = field.replace(/\[[0-9]+\]/g, '').split('.').filter(Boolean).join(' ');
  return leaf
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function deriveInputHint(field, contractSummary = {}) {
  const normalized = normalizeFieldName(field && field.field ? field.field : '');
  const kind = field && typeof field.kind === 'string' ? field.kind : contractSummary.expected;
  const sensitive = Boolean(field && field.sensitive);
  let type = primitiveInputType(kind);
  let autocomplete = null;

  if (normalized === 'email') {
    type = 'email';
    autocomplete = 'email';
  } else if (normalized === 'url' || normalized === 'website') {
    type = 'url';
  } else if (normalized === 'phone' || normalized === 'tel') {
    type = 'tel';
    autocomplete = 'tel';
  } else if (isPasswordLike(normalized)) {
    type = 'password';
    autocomplete = normalized === 'currentpassword' ? 'current-password' : null;
  } else if (normalized === 'name') {
    autocomplete = 'name';
  } else if (normalized === 'username') {
    autocomplete = 'username';
  }

  if (sensitive && isPasswordLike(normalized)) type = 'password';

  return {
    type: type,
    mode: null,
    autocomplete: autocomplete
  };
}

export function isSensitiveField(pathOrField) {
  const segments = Array.isArray(pathOrField) ? pathOrField : fieldPath(pathOrField);
  return segments.some((segment) => typeof segment === 'string' && isSensitiveSegment(segment));
}

export function projectFieldsFromContractProjection(projection) {
  if (!projection) return opaqueFields('Action input contract is missing');
  if (projection.opaque) return opaqueFields('Action input contract is opaque');
  if (projection.kind !== 'sigil') return opaqueFields('Action input contract is unsupported');
  if (!Array.isArray(projection.fields)) return opaqueFields('Action input contract fields are unavailable');

  const fields = flattenProjectedFields(projection.fields, [], projection.kind);
  if (fields.length === 0) return opaqueFields('Action input contract fields are unavailable');

  return { opaque: false, fields: fields, reason: null };
}

function flattenProjectedFields(fields, parentPath, contractKind) {
  const result = [];
  const ordered = Array.isArray(fields) ? fields.slice() : [];

  for (const field of ordered) {
    if (!field || typeof field.name !== 'string') continue;
    const path = parentPath.concat(field.name);
    const kind = typeof field.kind === 'string' ? field.kind : 'unknown';

    if (kind === 'object' && Array.isArray(field.fields) && field.fields.length > 0) {
      result.push(...flattenProjectedFields(field.fields, path, contractKind));
      continue;
    }

    result.push(createFieldProjection({
      name: pathToField(path),
      path: path,
      field: pathToField(path),
      kind: kind,
      required: field.required === true,
      multiple: kind === 'array',
      contractKind: contractKind
    }));
  }

  return result;
}

function createFormProjection(input) {
  return {
    kind: 'form',
    id: input.id,
    actionId: input.actionId,
    method: input.method,
    encType: input.encType,
    opaque: input.opaque,
    fields: input.fields,
    reason: input.reason,
    errors: { rootKey: ROOT_ERROR_KEY },
    values: { preservation: 'safe-parsed-values' },
    validation: {
      server: 'authoritative',
      client: 'projection-only'
    },
    redirect: { afterPost: 'explicit-303-recommended' },
    meta: input.meta
  };
}

function opaqueFields(reason) {
  return { opaque: true, fields: null, reason: reason };
}

function optionString(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function primitiveInputType(kind) {
  if (kind === 'number' || kind === 'integer') return 'number';
  if (kind === 'boolean') return 'checkbox';
  return 'text';
}

function isPasswordLike(normalized) {
  return normalized === 'password' || normalized === 'confirmpassword' || normalized === 'currentpassword' || normalized === 'newpassword';
}

function isSensitiveSegment(segment) {
  const normalized = normalizeFieldName(segment);
  if (SENSITIVE_SEGMENTS.has(normalized)) return true;
  for (const sensitive of SENSITIVE_SEGMENTS) {
    if (normalized.includes(sensitive)) return true;
  }
  return false;
}

function fieldPath(field) {
  if (typeof field !== 'string' || field.length === 0) return [];
  const path = [];
  for (const part of field.split('.')) {
    const match = /^([^\[]+)(?:\[([0-9]+)\])?$/.exec(part);
    if (!match) {
      path.push(part);
      continue;
    }
    path.push(match[1]);
    if (match[2] !== undefined) path.push(Number(match[2]));
  }
  return path;
}

function pathToField(path) {
  if (!Array.isArray(path) || path.length === 0) return '';
  let field = '';
  for (const segment of path) {
    if (typeof segment === 'number') {
      field += `[${segment}]`;
    } else if (field.length === 0) {
      field = segment;
    } else {
      field += `.${segment}`;
    }
  }
  return field;
}

function normalizeFieldName(value) {
  return String(value).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
}
