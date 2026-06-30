import path from 'node:path';

export const FILE_ROUTE_DIAGNOSTIC_CODES = Object.freeze({
  COLLISION: 'POTENTIA_FILE_ROUTE_COLLISION',
  UNSUPPORTED_CATCH_ALL: 'POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL',
  UNSUPPORTED_OPTIONAL_PARAM: 'POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM',
  UNSUPPORTED_GROUP: 'POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP',
  INVALID_PARAM: 'POTENTIA_FILE_ROUTE_INVALID_PARAM',
  MISSING_ROOT: 'POTENTIA_FILE_ROUTE_MISSING_ROOT'
});

export function mapRouteFile(filePath, rootDir) {
  const normalizedFile = normalizePath(filePath);
  const normalizedRoot = normalizePath(rootDir);
  const relativePath = normalizeRelative(path.posix.relative(normalizedRoot, normalizedFile));
  const parts = relativePath.split('/').filter(Boolean);
  const fileName = parts.at(-1) || '';

  if (!relativePath || relativePath.startsWith('..')) {
    return invalid(normalizedFile, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.MISSING_ROOT, 'Route file is outside the route root');
  }

  const privateFolder = parts.slice(0, -1).find((part) => part.startsWith('_'));
  if (privateFolder) return ignored(normalizedFile, relativePath, 'private-folder');

  if (!fileName.endsWith('.js')) return ignored(normalizedFile, relativePath, 'unsupported-extension');
  if (fileName.startsWith('_')) return ignored(normalizedFile, relativePath, 'private-file');

  const routeSegments = [];
  for (const part of parts) {
    const segment = part === fileName ? stripExtension(part) : part;
    if (segment === 'index' && part === fileName) continue;
    const mapped = mapSegment(segment, normalizedFile, relativePath);
    if (!mapped.ok) return mapped;
    routeSegments.push(mapped.segment);
  }

  const routePath = routeSegments.length === 0 ? '/' : `/${routeSegments.join('/')}`;
  return {
    ok: true,
    filePath: normalizedFile,
    relativePath: relativePath,
    routePath: routePath,
    kind: 'route',
    ignored: false,
    reason: null,
    error: null,
    segments: routeSegments
  };
}

export function normalizePath(value) {
  return String(value || '').replaceAll('\\\\', '/').replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

function normalizeRelative(value) {
  return String(value || '').replaceAll('\\\\', '/').replace(/\/+/g, '/');
}

function stripExtension(fileName) {
  return fileName.slice(0, -'.js'.length);
}

function mapSegment(segment, filePath, relativePath) {
  if (!segment) return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.INVALID_PARAM, 'Empty route segment is not supported');

  if (segment.startsWith('(') && segment.endsWith(')')) {
    return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.UNSUPPORTED_GROUP, 'Route groups are deferred');
  }

  if (segment.startsWith('[[') && segment.endsWith(']]')) {
    return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.UNSUPPORTED_OPTIONAL_PARAM, 'Optional route params are deferred');
  }

  if (segment.startsWith('[...') && segment.endsWith(']')) {
    return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.UNSUPPORTED_CATCH_ALL, 'Catch-all route params are deferred');
  }

  if (segment.startsWith('[') && segment.endsWith(']')) {
    const name = segment.slice(1, -1);
    if (!/^[A-Za-z0-9_-]+$/.test(name)) {
      return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.INVALID_PARAM, 'Dynamic route param name is invalid');
    }
    return { ok: true, segment: `:${name}` };
  }

  if (segment.includes('[') || segment.includes(']')) {
    return invalid(filePath, relativePath, FILE_ROUTE_DIAGNOSTIC_CODES.INVALID_PARAM, 'Dynamic route param syntax is invalid');
  }

  return { ok: true, segment: segment };
}

function ignored(filePath, relativePath, reason) {
  return {
    ok: true,
    filePath: filePath,
    relativePath: relativePath,
    routePath: null,
    kind: 'ignored',
    ignored: true,
    reason: reason,
    error: null,
    segments: []
  };
}

function invalid(filePath, relativePath, code, message) {
  return {
    ok: false,
    filePath: filePath,
    relativePath: relativePath,
    routePath: null,
    kind: 'invalid',
    ignored: false,
    reason: null,
    error: {
      code: code,
      message: message,
      filePath: filePath,
      relativePath: relativePath
    },
    segments: []
  };
}
