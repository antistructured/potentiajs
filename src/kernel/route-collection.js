import { route } from './route.js';

export function createRoutes(options = {}) {
  return {
    kind: 'routes',
    prefix: normalizePrefix(options.prefix || ''),
    routes: Array.isArray(options.routes) ? options.routes.slice() : [],
    hooks: normalizeHooks(options.hooks),
    contracts: normalizeContracts(options.contracts),
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null
  };
}

export function mount(source, options = {}) {
  return {
    kind: 'mount',
    source: source,
    prefix: normalizePrefix(options.prefix || ''),
    hooks: normalizeHooks(options.hooks),
    contracts: normalizeContracts(options.contracts),
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null
  };
}

export function composeRoutes(entries = []) {
  const routes = Array.isArray(entries) ? entries : [];
  return flattenRoutes(routes, emptyScope());
}

function flattenRoutes(entries, scope) {
  const flattened = [];

  for (const entry of entries) {
    if (isMount(entry)) {
      flattened.push(...flattenMounted(entry, scope));
      continue;
    }

    if (isRouteCollection(entry)) {
      flattened.push(...flattenCollection(entry, scope));
      continue;
    }

    if (isRoute(entry)) {
      flattened.push(cloneRoute(entry, scope));
    }
  }

  return flattened;
}

function flattenMounted(entry, scope) {
  const nextScope = mergeScope(scope, {
    prefix: entry.prefix,
    contracts: entry.contracts,
    hooks: entry.hooks
  });

  if (isRoute(entry.source)) return [cloneRoute(entry.source, nextScope)];
  if (isRouteCollection(entry.source)) return flattenCollection(entry.source, nextScope);
  if (Array.isArray(entry.source)) return flattenRoutes(entry.source, nextScope);
  return [];
}

function flattenCollection(collection, scope) {
  const nextScope = mergeScope(scope, {
    prefix: collection.prefix,
    contracts: collection.contracts,
    hooks: collection.hooks
  });

  return flattenRoutes(collection.routes, nextScope);
}

function cloneRoute(source, scope) {
  const cloned = route(source.method, composePath(scope.prefix, source.path), source.handler, {
    ...scope.contracts,
    ...(source.options || {})
  });
  cloned.hooks = normalizeHooks(scope.hooks);
  return cloned;
}

function emptyScope() {
  return {
    prefix: '',
    contracts: {},
    hooks: normalizeHooks()
  };
}

function mergeScope(parent, child) {
  const childHooks = normalizeHooks(child.hooks);
  return {
    prefix: composePath(parent.prefix, child.prefix || ''),
    contracts: {
      ...parent.contracts,
      ...normalizeContracts(child.contracts)
    },
    hooks: {
      beforeRequest: parent.hooks.beforeRequest.concat(childHooks.beforeRequest),
      afterResponse: childHooks.afterResponse.concat(parent.hooks.afterResponse),
      onError: childHooks.onError.concat(parent.hooks.onError)
    }
  };
}

export function normalizeHooks(hooks = {}) {
  return {
    beforeRequest: Array.isArray(hooks.beforeRequest) ? hooks.beforeRequest.slice() : [],
    afterResponse: Array.isArray(hooks.afterResponse) ? hooks.afterResponse.slice() : [],
    onError: Array.isArray(hooks.onError) ? hooks.onError.slice() : []
  };
}

function normalizeContracts(contracts = {}) {
  if (!contracts || typeof contracts !== 'object') return {};
  return { ...contracts };
}

function normalizePrefix(prefix) {
  if (!prefix) return '';
  const normalized = `/${String(prefix).split('/').filter(Boolean).join('/')}`;
  return normalized === '/' ? '' : normalized;
}

function composePath(prefix, path) {
  const parts = [];
  for (const value of [prefix, path]) {
    const segment = String(value || '').split('/').filter(Boolean).join('/');
    if (segment) parts.push(segment);
  }

  if (parts.length === 0) return '/';
  return `/${parts.join('/')}`;
}

function isMount(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'mount');
}

function isRouteCollection(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'routes' && Array.isArray(value.routes));
}

function isRoute(value) {
  return Boolean(value && typeof value === 'object' && typeof value.method === 'string' && typeof value.path === 'string' && Object.prototype.hasOwnProperty.call(value, 'handler'));
}
