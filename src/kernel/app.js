import { applyContract, applyNamedRequestContract, createContractFailure, parseContractBody } from './contract.js';
import { createRequestContext } from './context.js';
import { createFrameworkError, ERROR_CODES, normalizeFrameworkError } from './error.js';
import { runEffect } from './effect.js';
import { pluginRoutes } from './plugin.js';
import { fail } from './result.js';
import { composeRoutes, normalizeHooks } from './route-collection.js';
import { matchRoute } from './route.js';
import { isResponseDescriptor, replaceResponseBody, responseBody, toResponse } from './response.js';

export function createApp(options = {}) {
  const state = Object.prototype.hasOwnProperty.call(options, 'state') ? options.state : null;
  const pluginRouteCollections = pluginRoutes(options.plugins, { state: state });
  const routes = composeRoutes((Array.isArray(options.routes) ? options.routes : []).concat(pluginRouteCollections));
  const hooks = normalizeHooks(options.hooks);

  return {
    routes: routes,
    state: state,
    hooks: hooks,
    fetch: async function fetch(request) {
      return handleRequest(request, routes, state, hooks);
    }
  };
}

async function handleRequest(request, routes, state, hooks) {
  const url = new URL(request.url);
  const match = matchRoute(routes, request.method, url.pathname);

  if (match.error) {
    return toResponse(fail(match.error));
  }

  if (!match.found) {
    if (!match.methodAllowed) {
      return methodNotAllowedResponse(match.allowed);
    }
    return toResponse(fail(createFrameworkError(ERROR_CODES.NOT_FOUND, 'No route matched the request path', { status: 404, expose: true })));
  }

  const context = createRequestContext(request, match, state);
  const routeHooks = normalizeHooks(match.route.hooks);
  const beforeHooks = hooks.beforeRequest.concat(routeHooks.beforeRequest);
  const afterHooks = routeHooks.afterResponse.concat(hooks.afterResponse);
  const errorHooks = routeHooks.onError.concat(hooks.onError);

  try {
    const before = await runBeforeRequestHooks(beforeHooks, context);
    if (before !== undefined) {
      return await projectAndRunAfterHooks(before, afterHooks, context);
    }

    await applyRequestContracts(context, match.route.options);

    const value = await runEffect(match.route.handler, context);
    const contracted = applyResponseContract(value, match.route.options);
    return await projectAndRunAfterHooks(contracted, afterHooks, context);
  } catch (error) {
    return handleError(error, errorHooks, context);
  }
}

async function applyRequestContracts(context, options) {
  context.params = applyNamedRequestContract('Params', options.params, context.params);
  context.query = applyNamedRequestContract('Query', options.query, context.query);
  context.headers = applyNamedRequestContract('Headers', options.headers, context.headers);

  if (options.body) {
    try {
      context.body = await parseContractBody(context.request, options.body);
    } catch (error) {
      throw error;
    }
  }
}

function applyResponseContract(value, options) {
  if (!options.response) return value;
  if (value instanceof Response) return value;

  try {
    const body = responseBody(value);
    const contractedBody = applyContract(options.response, body);
    return replaceResponseBody(value, contractedBody);
  } catch (error) {
    return fail(createContractFailure('response', 'Response failed contract validation', error, {
      code: ERROR_CODES.RESPONSE_CONTRACT_FAILED,
      status: 500
    }));
  }
}

async function runBeforeRequestHooks(hooks, context) {
  for (const hook of hooks) {
    const value = await runEffect(hook, context);
    if (isHookResponse(value)) return value;
  }

  return undefined;
}

async function projectAndRunAfterHooks(value, hooks, context) {
  let response = toResponse(value);

  for (const hook of hooks) {
    const replacement = await runEffect(hook, context, response);
    if (isHookResponse(replacement)) response = toResponse(replacement);
  }

  return response;
}

async function handleError(error, hooks, context) {
  const normalized = normalizeFrameworkError(error);

  for (const hook of hooks) {
    try {
      const replacement = await runEffect(hook, context, normalized);
      if (isHookResponse(replacement)) return toResponse(replacement);
    } catch (hookError) {
      return toResponse(hookError);
    }
  }

  return toResponse(fail(normalized));
}

function methodNotAllowedResponse(allowed) {
  const response = toResponse(fail(createFrameworkError(ERROR_CODES.METHOD_NOT_ALLOWED, 'Route matched the path, but not the request method', { status: 405, expose: true })));
  response.headers.set('allow', allowed.join(', '));
  return response;
}

function isHookResponse(value) {
  return value instanceof Response || isResponseDescriptor(value) || isResult(value);
}

function isResult(value) {
  return Boolean(value && typeof value === 'object' && typeof value.ok === 'boolean' && 'value' in value && 'error' in value && 'meta' in value);
}
