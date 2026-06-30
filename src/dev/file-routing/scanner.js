import fs from 'node:fs';
import path from 'node:path';

import { routeCollisionDiagnostics } from './diagnostics.js';
import { FILE_ROUTE_DIAGNOSTIC_CODES, mapRouteFile, normalizePath } from './path-mapping.js';

export function scanRouteTree(rootDir) {
  const normalizedRoot = normalizePath(rootDir);

  if (!fs.existsSync(normalizedRoot) || !fs.statSync(normalizedRoot).isDirectory()) {
    return emptyScan(normalizedRoot, [{
      code: FILE_ROUTE_DIAGNOSTIC_CODES.MISSING_ROOT,
      message: 'Route root directory was not found',
      rootDir: normalizedRoot
    }]);
  }

  const files = listFiles(normalizedRoot);
  const routes = [];
  const scopes = [];
  const ignored = [];
  const errors = [];

  for (const filePath of files) {
    const relativePath = normalizeRelative(path.posix.relative(normalizedRoot, filePath));
    const fileName = path.posix.basename(filePath);

    if (isPrivateFolder(relativePath)) {
      ignored.push(ignoredEntry(filePath, normalizedRoot, 'private-folder'));
      continue;
    }

    if (fileName === '_routes.js') {
      scopes.push(scopeEntry(filePath, normalizedRoot));
      continue;
    }

    const mapped = mapRouteFile(filePath, normalizedRoot);
    if (!mapped.ok) {
      errors.push(mapped.error);
      continue;
    }

    if (mapped.ignored) {
      ignored.push({ ...mapped, importPath: toImportPath(relativePath) });
      continue;
    }

    routes.push({
      filePath: mapped.filePath,
      importPath: toImportPath(mapped.relativePath),
      routePath: mapped.routePath,
      segments: mapped.segments,
      kind: 'route'
    });
  }

  const sortedRoutes = sortByPath(routes);
  const allErrors = sortErrors(errors.concat(routeCollisionDiagnostics(sortedRoutes)));

  return {
    ok: allErrors.length === 0,
    rootDir: normalizedRoot,
    routes: sortedRoutes,
    scopes: sortByPath(scopes),
    ignored: sortByFile(ignored),
    errors: allErrors
  };
}

function emptyScan(rootDir, errors = []) {
  return {
    ok: errors.length === 0,
    rootDir: rootDir,
    routes: [],
    scopes: [],
    ignored: [],
    errors: errors
  };
}

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name));
  const files = [];

  for (const entry of entries) {
    const entryPath = normalizePath(path.posix.join(dir, entry.name));
    if (entry.isDirectory()) {
      files.push(...listFiles(entryPath));
      continue;
    }
    if (entry.isFile()) files.push(entryPath);
  }

  return files;
}

function scopeEntry(filePath, rootDir) {
  const normalizedFile = normalizePath(filePath);
  const relativePath = normalizeRelative(path.posix.relative(rootDir, normalizedFile));
  const directoryRelative = normalizeRelative(path.posix.dirname(relativePath));
  const segments = directoryRelative === '.' ? [] : directoryRelative.split('/').filter(Boolean);
  const routePath = segments.length === 0 ? '/' : `/${segments.join('/')}`;

  return {
    filePath: normalizedFile,
    importPath: toImportPath(relativePath),
    routePath: routePath,
    directoryPath: normalizePath(path.posix.dirname(normalizedFile)),
    segments: segments,
    kind: 'scope'
  };
}

function ignoredEntry(filePath, rootDir, reason) {
  const normalizedFile = normalizePath(filePath);
  const relativePath = normalizeRelative(path.posix.relative(rootDir, normalizedFile));
  return {
    ok: true,
    filePath: normalizedFile,
    relativePath: relativePath,
    importPath: toImportPath(relativePath),
    routePath: null,
    kind: 'ignored',
    ignored: true,
    reason: reason,
    error: null,
    segments: []
  };
}

function isPrivateFolder(relativePath) {
  return relativePath.split('/').filter(Boolean).slice(0, -1).some((part) => part.startsWith('_'));
}

function toImportPath(relativePath) {
  return `./${normalizeRelative(relativePath)}`;
}

function normalizeRelative(value) {
  return String(value || '').replaceAll('\\\\', '/').replace(/\/+/g, '/');
}

function sortByPath(values) {
  return values.slice().sort((a, b) => a.routePath.localeCompare(b.routePath) || a.filePath.localeCompare(b.filePath));
}

function sortByFile(values) {
  return values.slice().sort((a, b) => a.filePath.localeCompare(b.filePath));
}

function sortErrors(values) {
  return values.slice().sort((a, b) => String(a.filePath || '').localeCompare(String(b.filePath || '')) || String(a.code).localeCompare(String(b.code)));
}
