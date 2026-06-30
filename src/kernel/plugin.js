import { createRoutes, normalizeHooks } from './route-collection.js';

export function createPlugin(options = {}) {
  return {
    kind: 'plugin',
    name: typeof options.name === 'string' ? options.name : 'anonymous',
    routes: Array.isArray(options.routes) ? options.routes.slice() : [],
    hooks: normalizeHooks(options.hooks),
    contracts: normalizeContracts(options.contracts),
    setup: typeof options.setup === 'function' ? options.setup : null,
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null
  };
}

export function pluginRoutes(plugins = [], appContext = {}) {
  if (!Array.isArray(plugins)) return [];

  const routes = [];
  for (const plugin of plugins) {
    const normalized = plugin && plugin.kind === 'plugin' ? plugin : createPlugin(plugin);
    runSetup(normalized, appContext);
    routes.push(createRoutes({
      routes: normalized.routes,
      hooks: normalized.hooks,
      contracts: normalized.contracts,
      meta: { plugin: normalized.name }
    }));
  }

  return routes;
}

function runSetup(plugin, appContext) {
  if (!plugin.setup) return;

  plugin.setup(Object.freeze({
    name: plugin.name,
    state: Object.prototype.hasOwnProperty.call(appContext, 'state') ? appContext.state : null,
    meta: plugin.meta
  }));
}

function normalizeContracts(contracts = {}) {
  if (!contracts || typeof contracts !== 'object') return {};
  return { ...contracts };
}
