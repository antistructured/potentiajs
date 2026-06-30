import { createFrameworkError, ERROR_CODES } from './error.js';

export function route(method, path, handler, options = {}) {
  const normalizedSource = normalizeSource(options.source);

  return {
    method: String(method).toUpperCase(),
    path: path,
    handler: handler,
    options: options,
    name: typeof options.name === 'string' ? options.name : null,
    source: normalizedSource,
    meta: Object.prototype.hasOwnProperty.call(options, 'meta') ? options.meta : null,
    pattern: parsePathPattern(path)
  };
}

export function normalizeSource(source) {
  if (!source || typeof source !== 'object') return null;

  return {
    file: typeof source.file === 'string' ? source.file : null,
    line: Number.isInteger(source.line) ? source.line : null,
    column: Number.isInteger(source.column) ? source.column : null
  };
}

export function matchRoute(routes, method, path) {
  const normalizedMethod = String(method).toUpperCase();
  const matches = [];
  const allowed = [];
  let error = null;

  for (let index = 0; index < routes.length; index += 1) {
    const candidate = routes[index];
    const pathMatch = matchPath(candidate.pattern, path);

    if (pathMatch.error) {
      error = pathMatch.error;
      continue;
    }

    if (!pathMatch.matched) continue;

    allowed.push(candidate.method);
    matches.push({
      route: candidate,
      params: pathMatch.params,
      score: candidate.pattern.score,
      index: index
    });
  }

  if (matches.length === 0) {
    return {
      found: false,
      methodAllowed: true,
      route: null,
      params: {},
      allowed: [],
      error: error
    };
  }

  matches.sort(compareMatches);

  for (const match of matches) {
    if (match.route.method === normalizedMethod) {
      return {
        found: true,
        methodAllowed: true,
        route: match.route,
        params: match.params,
        allowed: allowed,
        error: null
      };
    }
  }

  return {
    found: false,
    methodAllowed: false,
    route: null,
    params: {},
    allowed: unique(allowed),
    error: null
  };
}

export function parsePathPattern(path) {
  const segments = splitPath(path);
  let staticCount = 0;
  let dynamicCount = 0;

  const parsedSegments = segments.map((segment) => {
    if (segment.startsWith(':') && segment.length > 1) {
      dynamicCount += 1;
      return { type: 'param', value: segment.slice(1) };
    }

    staticCount += 1;
    return { type: 'static', value: segment };
  });

  return {
    path: path,
    segments: parsedSegments,
    score: staticCount * 10 - dynamicCount
  };
}

function matchPath(pattern, path) {
  const pathSegments = splitPath(path);

  if (pattern.segments.length !== pathSegments.length) {
    return { matched: false, params: {}, error: null };
  }

  const params = {};

  for (let index = 0; index < pattern.segments.length; index += 1) {
    const patternSegment = pattern.segments[index];
    const pathSegment = pathSegments[index];

    if (patternSegment.type === 'static') {
      if (patternSegment.value !== pathSegment) return { matched: false, params: {}, error: null };
      continue;
    }

    try {
      params[patternSegment.value] = decodeURIComponent(pathSegment);
    } catch (error) {
      return {
        matched: false,
        params: {},
        error: createFrameworkError(ERROR_CODES.BAD_REQUEST, 'Invalid route parameter encoding', { status: 400, cause: error, expose: true })
      };
    }
  }

  return { matched: true, params: params, error: null };
}

function splitPath(path) {
  if (path === '/') return [];
  return String(path).split('/').filter(Boolean);
}

function compareMatches(a, b) {
  if (a.score !== b.score) return b.score - a.score;
  return a.index - b.index;
}

function unique(values) {
  return Array.from(new Set(values));
}
