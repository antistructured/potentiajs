import { createRouteId, normalizeRoutePath } from './route-id.js';
import { projectRoutes } from './route-projection.js';

export { createRouteId, normalizeRoutePath };

export function createRouteManifest(input, options = {}) {
  const projected = projectRoutes(input);
  const diagnostics = [];

  if (projected.kind !== 'routes') {
    diagnostics.push(createDiagnostic('POTENTIA_MANIFEST_INVALID_ROUTE', 'Manifest input could not be projected as routes', { index: null, routeId: null, routeName: null }));
  }

  const routes = projected.routes.map((route, index) => manifestRoute(route, index));
  const actions = projected.routes.map((route, index) => manifestAction(route, index)).filter(Boolean);
  const lookupResult = buildLookups(routes);
  diagnostics.push(...lookupResult.diagnostics);

  return {
    kind: 'potentia-route-manifest',
    version: 1,
    package: {
      name: typeof options.packageName === 'string' ? options.packageName : null,
      version: typeof options.packageVersion === 'string' ? options.packageVersion : null
    },
    routes: routes,
    actions: actions,
    lookups: lookupResult.lookups,
    diagnostics: diagnostics,
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null
  };
}

function manifestAction(route, index) {
  if (!route.action) return null;

  return {
    kind: 'action',
    id: route.action.id,
    routeId: route.id || createRouteId(route),
    method: route.method,
    path: normalizeRoutePath(route.path),
    input: route.action.input,
    output: route.action.output,
    result: route.action.result,
    contentTypes: ['application/json', 'application/x-www-form-urlencoded'],
    enhancement: {
      plainForm: true,
      fetch: true,
      clientValidation: 'projection-only'
    },
    source: route.action.source || null,
    meta: route.action.meta || null,
    index: index
  };
}

function manifestRoute(route, index) {
  return {
    id: route.id || createRouteId(route),
    name: route.name || null,
    method: route.method,
    path: normalizeRoutePath(route.path),
    contracts: route.contracts,
    hooks: route.hooks,
    source: route.source || null,
    meta: route.meta || null,
    index: index
  };
}

function buildLookups(routes) {
  const lookups = emptyLookups();
  const diagnostics = [];

  for (const route of routes) {
    if (!route.id || !route.method || !route.path) {
      diagnostics.push(createDiagnostic('POTENTIA_MANIFEST_INVALID_ROUTE', 'Manifest route is missing method, path, or id', diagnosticDetail(route)));
      continue;
    }

    if (Object.prototype.hasOwnProperty.call(lookups.byId, route.id)) {
      diagnostics.push(createDiagnostic('POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID', `Duplicate route id: ${route.id}`, diagnosticDetail(route)));
    } else {
      lookups.byId[route.id] = route.index;
    }

    if (route.name) {
      if (Object.prototype.hasOwnProperty.call(lookups.byName, route.name)) {
        diagnostics.push(createDiagnostic('POTENTIA_MANIFEST_DUPLICATE_ROUTE_NAME', `Duplicate route name: ${route.name}`, diagnosticDetail(route)));
      } else {
        lookups.byName[route.name] = route.id;
      }
    }

    const methodPath = `${route.method} ${route.path}`;
    if (Object.prototype.hasOwnProperty.call(lookups.byMethodPath, methodPath)) {
      diagnostics.push(createDiagnostic('POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID', `Duplicate route method/path: ${methodPath}`, diagnosticDetail(route)));
    } else {
      lookups.byMethodPath[methodPath] = route.id;
    }
  }

  return { lookups: lookups, diagnostics: diagnostics };
}

function emptyLookups() {
  return {
    byId: {},
    byName: {},
    byMethodPath: {}
  };
}

function createDiagnostic(code, message, detail) {
  return {
    code: code,
    message: message,
    detail: detail || null
  };
}

function diagnosticDetail(route) {
  return {
    index: Number.isInteger(route.index) ? route.index : null,
    routeId: route.id || null,
    routeName: route.name || null
  };
}
