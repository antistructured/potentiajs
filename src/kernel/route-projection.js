import { projectContract } from './contract-projection.js';
import { createRouteId } from './route-id.js';
import { composeRoutes } from './route-collection.js';

const CONTRACT_BOUNDARIES = ['params', 'query', 'headers', 'body', 'response'];

export function projectRoute(value) {
  if (!isRoute(value)) {
    return {
      kind: 'unknown-route',
      id: null,
      name: null,
      method: null,
      path: null,
      contracts: emptyProjectedContracts(),
      hooks: emptyHookSummary(),
      source: null,
      meta: null
    };
  }

  return {
    kind: 'route',
    id: createRouteId(value),
    name: typeof value.name === 'string' ? value.name : null,
    method: value.method,
    path: value.path,
    contracts: projectContractBoundaries(value.options),
    hooks: summarizeHooks(value.hooks),
    source: value.source || null,
    meta: Object.prototype.hasOwnProperty.call(value, 'meta') ? value.meta : null
  };
}

export function projectRoutes(value) {
  if (Array.isArray(value)) {
    return projectRouteSet({
      prefix: null,
      routes: composeRoutes(value),
      hooks: {},
      contracts: {},
      meta: null
    });
  }

  if (isRouteCollection(value) || isMount(value)) {
    return projectRouteSet({
      prefix: value.prefix,
      routes: composeRoutes([value]),
      hooks: value.hooks,
      contracts: value.contracts,
      meta: Object.prototype.hasOwnProperty.call(value, 'meta') ? value.meta : null
    });
  }

  if (isApp(value)) {
    return projectRouteSet({
      prefix: null,
      routes: value.routes,
      hooks: value.hooks,
      contracts: {},
      meta: null
    });
  }

  return {
    kind: 'unknown-routes',
    prefix: null,
    routes: [],
    hooks: emptyHookSummary(),
    contracts: emptyProjectedContracts(),
    meta: null
  };
}

export function projectContractBoundaries(contracts = {}) {
  const projected = {};
  for (const boundary of CONTRACT_BOUNDARIES) {
    projected[boundary] = contracts && Object.prototype.hasOwnProperty.call(contracts, boundary) ? projectContract(contracts[boundary]) : null;
  }
  return projected;
}

export function summarizeHooks(hooks = {}) {
  return {
    beforeRequest: Array.isArray(hooks.beforeRequest) ? hooks.beforeRequest.length : 0,
    afterResponse: Array.isArray(hooks.afterResponse) ? hooks.afterResponse.length : 0,
    onError: Array.isArray(hooks.onError) ? hooks.onError.length : 0
  };
}

function projectRouteSet(value) {
  return {
    kind: 'routes',
    prefix: value.prefix,
    routes: value.routes.map(projectRoute),
    hooks: summarizeHooks(value.hooks),
    contracts: projectContractBoundaries(value.contracts),
    meta: value.meta
  };
}

function emptyProjectedContracts() {
  return {
    params: null,
    query: null,
    headers: null,
    body: null,
    response: null
  };
}

function emptyHookSummary() {
  return {
    beforeRequest: 0,
    afterResponse: 0,
    onError: 0
  };
}

function isRoute(value) {
  return Boolean(value && typeof value === 'object' && typeof value.method === 'string' && typeof value.path === 'string' && Object.prototype.hasOwnProperty.call(value, 'handler'));
}

function isRouteCollection(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'routes' && Array.isArray(value.routes));
}

function isMount(value) {
  return Boolean(value && typeof value === 'object' && value.kind === 'mount');
}

function isApp(value) {
  return Boolean(value && typeof value === 'object' && Array.isArray(value.routes) && typeof value.fetch === 'function');
}
