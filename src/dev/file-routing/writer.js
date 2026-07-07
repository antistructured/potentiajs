import { mkdir, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { generateRouteModule } from './generator.js';
import { normalizePath } from './path-mapping.js';
import { scanRouteTree } from './scanner.js';

export async function generateFileRoutes(options = {}) {
  const rootDir = resolveOptionPath(options.rootDir, options.cwd);
  const outputFile = resolveOptionPath(options.outputFile, options.cwd);

  if (!rootDir || !outputFile) {
    return failureResult(rootDir, outputFile, [{
      code: 'POTENTIA_FILE_ROUTE_INVALID_OPTIONS',
      message: 'rootDir and outputFile are required'
    }]);
  }

  const scan = scanRouteTree(rootDir);
  if (!scan.ok || scan.errors.length > 0) {
    return failureResult(rootDir, outputFile, scan.errors, scan.routes.length, scan.scopes.length);
  }

  const generated = generateRouteModule(scan, {
    outputPath: outputFile,
    packageName: options.packageName
  });

  if (!generated.ok || generated.errors.length > 0) {
    return failureResult(rootDir, outputFile, generated.errors, scan.routes.length, scan.scopes.length);
  }

  const tempFile = `${outputFile}.tmp-${process.pid}-${Date.now()}`;

  try {
    await mkdir(path.posix.dirname(outputFile), { recursive: true });
    await writeFile(tempFile, generated.source);
    await rename(tempFile, outputFile);
  } catch (error) {
    await rm(tempFile, { force: true }).catch(() => {});
    return failureResult(rootDir, outputFile, [{
      code: 'POTENTIA_FILE_ROUTE_WRITE_FAILED',
      message: 'Failed to write generated route module',
      outputFile: outputFile,
      cause: error instanceof Error ? error.message : String(error)
    }], scan.routes.length, scan.scopes.length);
  }

  return {
    ok: true,
    rootDir: rootDir,
    outputFile: outputFile,
    written: true,
    source: generated.source,
    routes: scan.routes.length,
    scopes: scan.scopes.length,
    diagnostics: [],
    errors: []
  };
}

function failureResult(rootDir, outputFile, errors, routes = 0, scopes = 0) {
  return {
    ok: false,
    rootDir: rootDir || null,
    outputFile: outputFile || null,
    written: false,
    source: '',
    routes: routes,
    scopes: scopes,
    diagnostics: errors,
    errors: errors
  };
}

function resolveOptionPath(value, cwd = process.cwd()) {
  if (!value) return null;
  const asString = String(value);
  if (path.posix.isAbsolute(asString)) return normalizePath(asString);
  return normalizePath(path.posix.resolve(cwd, asString));
}
