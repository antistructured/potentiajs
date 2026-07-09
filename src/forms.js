const DEFAULT_METHOD = 'POST';
const DEFAULT_ENCTYPE = 'application/x-www-form-urlencoded';
const DEFAULT_SUBMIT_LABEL = 'Submit';
const DEFAULT_ID_PREFIX = 'potentia-form';
const OPAQUE_MESSAGE = 'This form cannot be rendered from opaque metadata.';
const INPUT_TYPES = new Set(['text', 'email', 'url', 'tel', 'password', 'number', 'checkbox', 'textarea', 'hidden']);
const INPUT_ELEMENT_TYPES = new Set(['text', 'email', 'url', 'tel', 'password', 'number', 'checkbox']);

export function renderForm(formProjection, options = {}) {
  const projection = normalizeProjection(formProjection);
  const state = normalizeState(options.state);
  const method = normalizeMethod(options.method || projection.method);
  const encType = normalizeEncType(projection.encType);
  const action = Object.prototype.hasOwnProperty.call(options, 'action') ? options.action : '#';
  const submitLabel = optionString(options.submitLabel, DEFAULT_SUBMIT_LABEL);
  const idPrefix = safeIdPart(optionString(options.idPrefix, optionString(projection.id, DEFAULT_ID_PREFIX)));
  const formId = optionString(projection.id, null);
  const attributes = {
    method: method,
    action: optionString(action, '#'),
    enctype: encType
  };

  if (formId) attributes['data-potentia-form'] = formId;

  const parts = [`<form${renderAttributes(attributes)}>`];

  if (projection.opaque || !Array.isArray(projection.fields)) {
    parts.push(`  <div data-potentia-form-error="opaque">${escapeHtml(OPAQUE_MESSAGE)}</div>`);
    parts.push('</form>');
    return parts.join('\n');
  }

  const rootErrors = getRootErrors(projection, state);
  if (rootErrors.length > 0) parts.push(indent(renderRootErrors(rootErrors), 2));

  for (const field of projection.fields) {
    parts.push(indent(renderField(field, { idPrefix: idPrefix, state: state }), 2));
  }

  parts.push(`  <button${renderAttributes({ type: 'submit', 'data-potentia-submit': true })}>${escapeHtml(submitLabel)}</button>`);
  parts.push('</form>');

  return parts.join('\n');
}

function renderField(field, context) {
  const normalized = normalizeField(field);
  const errors = getFieldErrors(context.state, normalized.field);
  const values = fieldValues(normalized, context.state);
  const firstId = fieldId(context.idPrefix, normalized.field, 0, values.length);
  const helpId = `${firstId}-help`;
  const errorsId = `${firstId}-errors`;

  if (normalized.inputType === 'hidden') {
    return renderHiddenControl(normalized, {
      id: firstId,
      value: values[0]
    });
  }

  const controls = values.map((value, index) => renderControl(normalized, {
    id: fieldId(context.idPrefix, normalized.field, index, values.length),
    value: value,
    describedBy: describedBy(normalized.help ? helpId : null, errors.length > 0 ? errorsId : null),
    invalid: errors.length > 0
  }));
  const wrapper = [`<div${renderAttributes({ 'data-potentia-field': normalized.field })}>`];

  wrapper.push(`  <label${renderAttributes({ 'data-potentia-label': normalized.field, for: firstId })}>${escapeHtml(normalized.label)}</label>`);
  for (const control of controls) wrapper.push(`  ${control}`);
  if (normalized.help) wrapper.push(`  <div${renderAttributes({ 'data-potentia-help': normalized.field, id: helpId })}>${escapeHtml(normalized.help)}</div>`);
  if (errors.length > 0) wrapper.push(indent(renderFieldErrors(normalized.field, errors, { id: errorsId }), 2));
  wrapper.push('</div>');

  return wrapper.join('\n');
}

function renderControl(field, context) {
  if (Array.isArray(field.options) && field.options.length > 0) return renderSelect(field, context);
  if (field.inputType === 'textarea') return renderTextarea(field, context);

  const type = INPUT_ELEMENT_TYPES.has(field.inputType) ? field.inputType : 'text';
  const attributes = baseControlAttributes(field, context, { type: type });

  if (type === 'checkbox') {
    attributes.value = 'true';
    if (isCheckedValue(context.value)) attributes.checked = true;
  } else if (!field.sensitive && context.value !== undefined && context.value !== null) {
    attributes.value = context.value;
  }

  return `<input${renderAttributes(attributes)}>`;
}

function renderTextarea(field, context) {
  const attributes = baseControlAttributes(field, context);
  const value = !field.sensitive && context.value !== undefined && context.value !== null ? context.value : '';
  return `<textarea${renderAttributes(attributes)}>${escapeHtml(value)}</textarea>`;
}

function renderHiddenControl(field, context) {
  const attributes = {
    'data-potentia-control': field.field,
    id: context.id,
    name: field.name,
    type: 'hidden'
  };

  if (!field.sensitive && context.value !== undefined && context.value !== null) attributes.value = context.value;

  return `<input${renderAttributes(attributes)}>`;
}

function renderSelect(field, context) {
  const attributes = baseControlAttributes(field, context);
  if (field.multiple) attributes.multiple = true;

  const selected = Array.isArray(context.value) ? context.value.map(String) : [String(context.value ?? '')];
  const options = field.options
    .map(normalizeOption)
    .filter(Boolean)
    .map((option) => `  <option${renderAttributes({ value: option.value, selected: selected.includes(String(option.value)) })}>${escapeHtml(option.label)}</option>`);

  return [`<select${renderAttributes(attributes)}>`, ...options, '</select>'].join('\n');
}

function baseControlAttributes(field, context, extra = {}) {
  const attributes = {
    'data-potentia-control': field.field,
    id: context.id,
    name: field.name,
    ...extra
  };

  if (field.required) attributes.required = true;
  if (field.placeholder) attributes.placeholder = field.placeholder;
  if (context.describedBy) attributes['aria-describedby'] = context.describedBy;
  if (context.invalid) attributes['aria-invalid'] = 'true';
  if (field.input && typeof field.input.autocomplete === 'string' && field.input.autocomplete.length > 0) {
    attributes.autocomplete = field.input.autocomplete;
  }

  return attributes;
}

function renderRootErrors(errors) {
  const parts = ['<div data-potentia-form-errors>'];
  for (const error of errors) parts.push(`  <p>${escapeHtml(errorMessage(error))}</p>`);
  parts.push('</div>');
  return parts.join('\n');
}

function renderFieldErrors(field, errors, options = {}) {
  const parts = [`<div${renderAttributes({ 'data-potentia-errors-for': field, id: options.id })}>`];
  for (const error of errors) parts.push(`  <p>${escapeHtml(errorMessage(error))}</p>`);
  parts.push('</div>');
  return parts.join('\n');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function renderAttributes(attributes) {
  const rendered = [];
  for (const [name, value] of Object.entries(attributes)) {
    if (value === false || value === null || value === undefined) continue;
    const safeName = safeAttributeName(name);
    if (!safeName) continue;
    if (value === true) {
      rendered.push(safeName);
    } else {
      rendered.push(`${safeName}="${escapeAttribute(value)}"`);
    }
  }
  return rendered.length > 0 ? ` ${rendered.join(' ')}` : '';
}

function normalizeMethod(method) {
  const normalized = typeof method === 'string' ? method.toUpperCase() : DEFAULT_METHOD;
  return normalized === 'GET' || normalized === 'POST' ? normalized : DEFAULT_METHOD;
}

function normalizeEncType(encType) {
  return encType === DEFAULT_ENCTYPE ? DEFAULT_ENCTYPE : DEFAULT_ENCTYPE;
}

function safeIdPart(value) {
  const normalized = String(value ?? '')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return normalized.length > 0 ? normalized : DEFAULT_ID_PREFIX;
}

function safeAttributeName(value) {
  return /^[a-zA-Z_:][a-zA-Z0-9:_.-]*$/.test(value) ? value : null;
}

function normalizeProjection(value) {
  if (!value || typeof value !== 'object' || value.kind !== 'form') {
    return {
      kind: 'form',
      id: null,
      method: DEFAULT_METHOD,
      encType: DEFAULT_ENCTYPE,
      opaque: true,
      fields: null,
      errors: { rootKey: '_form' }
    };
  }
  return value;
}

function normalizeState(value) {
  if (!value || typeof value !== 'object' || value.kind !== 'form') return { values: {}, errors: {} };
  return {
    values: value.values && typeof value.values === 'object' ? value.values : {},
    errors: value.errors && typeof value.errors === 'object' ? value.errors : {}
  };
}

function normalizeField(field) {
  const fieldName = optionString(field && (field.field || field.name), 'field');
  const input = normalizeInput(field && field.input);
  return {
    name: optionString(field && field.name, fieldName),
    field: fieldName,
    label: optionString(field && field.label, fieldName),
    help: optionString(field && field.help, null),
    placeholder: optionString(field && field.placeholder, null),
    input: input,
    inputType: getFieldInputType(field),
    required: Boolean(field && field.required),
    multiple: Boolean(field && field.multiple),
    sensitive: Boolean(field && field.sensitive),
    options: Array.isArray(field && field.options) ? field.options : null,
    defaultValue: field && Object.prototype.hasOwnProperty.call(field, 'defaultValue') ? field.defaultValue : undefined
  };
}

function normalizeInput(input) {
  if (input && typeof input === 'object') return input;
  if (typeof input === 'string' && input.length > 0) return { type: input };
  return { type: 'text' };
}

function getFieldInputType(field) {
  const input = field && field.input;
  let type = null;

  if (typeof input === 'string') type = input;
  if (input && typeof input === 'object' && typeof input.type === 'string') type = input.type;

  const normalized = typeof type === 'string' ? type.toLowerCase() : 'text';
  return INPUT_TYPES.has(normalized) ? normalized : 'text';
}

function normalizeOption(option) {
  if (typeof option === 'string' || typeof option === 'number' || typeof option === 'boolean') {
    return { value: option, label: option };
  }

  if (option && typeof option === 'object') {
    if (!Object.prototype.hasOwnProperty.call(option, 'value')) return null;
    const value = option.value;
    if (value === undefined || value === null) return null;
    const label = Object.prototype.hasOwnProperty.call(option, 'label') ? option.label : value;
    return { value: value, label: label ?? '' };
  }

  return null;
}

function fieldValues(field, state) {
  if (field.sensitive) return [undefined];
  const value = Object.prototype.hasOwnProperty.call(state.values, field.field) ? state.values[field.field] : field.defaultValue;
  if (field.multiple && Array.isArray(value) && value.length > 0) return value;
  return [value];
}

function getRootErrors(projection, state) {
  const key = projection && projection.errors && typeof projection.errors.rootKey === 'string' && projection.errors.rootKey.length > 0 ? projection.errors.rootKey : '_form';
  return arrayErrors(state.errors[key]);
}

function getFieldErrors(state, field) {
  return arrayErrors(state.errors[field]);
}

function arrayErrors(value) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function errorMessage(error) {
  if (error && typeof error === 'object' && typeof error.message === 'string' && error.message.length > 0) return error.message;
  if (typeof error === 'string') return error;
  return 'Invalid value';
}

function fieldId(prefix, field, index, count) {
  const base = `${safeIdPart(prefix)}-${safeIdPart(field)}`;
  return count > 1 ? `${base}-${index + 1}` : base;
}

function describedBy(...ids) {
  const valid = ids.filter((id) => typeof id === 'string' && id.length > 0);
  return valid.length > 0 ? valid.join(' ') : null;
}

function isCheckedValue(value) {
  return value === true || value === 'true' || value === 'on' || value === '1' || value === 1;
}

function optionString(value, fallback) {
  return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function indent(value, spaces) {
  const padding = ' '.repeat(spaces);
  return String(value).split('\n').map((line) => `${padding}${line}`).join('\n');
}
