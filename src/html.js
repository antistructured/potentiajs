const HTML_VALUE = Symbol('PotentiaHTMLValue');
const ATTRIBUTE_NAME = /^[A-Za-z_:][A-Za-z0-9:_.-]*$/;
const EVENT_ATTRIBUTE = /^on/i;

class PotentiaHtmlValue {
  constructor(value) {
    Object.defineProperty(this, HTML_VALUE, {
      value: true,
      enumerable: false
    });
    this.value = String(value ?? '');
    Object.freeze(this);
  }

  toString() {
    return this.value;
  }
}

function createHtmlValue(value) {
  return new PotentiaHtmlValue(value);
}

function isHtmlValue(value) {
  return Boolean(
    value &&
    typeof value === 'object' &&
    value[HTML_VALUE] === true &&
    value instanceof PotentiaHtmlValue
  );
}

function renderChild(value) {
  if (value === null || value === undefined) return '';
  if (isHtmlValue(value)) return value.toString();
  if (Array.isArray(value)) return renderChildren(value);
  return escapeHtml(value);
}

function renderChildren(values) {
  let output = '';

  for (const value of values) {
    output += renderChild(value);
  }

  return output;
}

export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  if (isHtmlValue(value)) return value.toString();

  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function raw(value) {
  return createHtmlValue(value);
}

export function html(strings, ...values) {
  if (!isTemplateStringsArray(strings)) {
    throw new TypeError('html must be used as a tagged template.');
  }

  let output = '';

  for (let index = 0; index < strings.length; index += 1) {
    output += strings[index];
    if (index < values.length) output += renderChild(values[index]);
  }

  return createHtmlValue(output);
}

export function fragment(...children) {
  return createHtmlValue(renderChildren(children));
}

export function attrs(attributes) {
  if (attributes === null || attributes === undefined) return createHtmlValue('');
  if (typeof attributes !== 'object' || Array.isArray(attributes)) {
    throw new TypeError('attrs expects a plain object of attributes.');
  }

  const rendered = [];

  for (const [rawName, rawValue] of Object.entries(attributes)) {
    const name = normalizeAttributeName(rawName);
    const value = normalizeAttributeValue(rawValue);

    if (value === null) continue;
    if (value === true) {
      rendered.push(name);
      continue;
    }

    rendered.push(`${name}="${escapeHtml(value)}"`);
  }

  return createHtmlValue(rendered.length > 0 ? ` ${rendered.join(' ')}` : '');
}

export function htmlResponse(body = '', init = {}) {
  const headers = new Headers(init.headers || {});

  if (!headers.has('content-type')) {
    headers.set('content-type', 'text/html; charset=utf-8');
  }

  return new Response(renderChild(body), {
    ...init,
    headers
  });
}

function isTemplateStringsArray(value) {
  return Array.isArray(value) && Array.isArray(value.raw) && Object.isFrozen(value.raw);
}

function normalizeAttributeName(name) {
  const normalized = name === 'className' ? 'class' : name;

  if (!ATTRIBUTE_NAME.test(normalized)) {
    throw new TypeError(`Invalid HTML attribute name: ${name}`);
  }

  if (EVENT_ATTRIBUTE.test(normalized)) {
    throw new TypeError(`Event handler attributes are not supported by attrs(): ${name}`);
  }

  return normalized;
}

function normalizeAttributeValue(value) {
  if (value === false || value === null || value === undefined) return null;
  if (value === true) return true;

  if (Array.isArray(value)) {
    const parts = value
      .flat(Infinity)
      .filter((part) => part !== false && part !== null && part !== undefined)
      .map((part) => String(part));
    return parts.join(' ');
  }

  return String(value);
}
