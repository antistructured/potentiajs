import path from 'node:path';

import { normalizePath } from './path-mapping.js';

export function generateRouteModule(scanResult, options = {}) {
  const outputPath = normalizePath(options.outputPath || '.potentia/routes.generated.js');
  const errors = Array.isArray(scanResult?.errors) ? scanResult.errors : [];

  if (!scanResult || scanResult.ok === false || errors.length > 0) {
    return {
      ok: false,
      source: '',
      outputPath: outputPath,
      imports: [],
      errors: errors.length > 0 ? errors : [{ code: 'POTENTIA_FILE_ROUTE_INVALID_SCAN', message: 'Scan result is invalid' }]
    };
  }

  const imports = buildImports(scanResult, outputPath);
  const source = renderModule(scanResult, imports, options.packageName || 'potentia-js');

  return {
    ok: true,
    source: source,
    outputPath: outputPath,
    imports: imports,
    errors: []
  };
}

function buildImports(scanResult, outputPath) {
  const imports = [];
  const outputDir = normalizePath(path.posix.dirname(outputPath));

  scanResult.routes.forEach((route, index) => {
    imports.push({
      kind: 'route',
      importName: `route${index}`,
      importPath: relativeImport(outputDir, route.filePath),
      filePath: route.filePath,
      routePath: route.routePath,
      segments: route.segments
    });
  });

  scanResult.scopes.forEach((scope, index) => {
    imports.push({
      kind: 'scope',
      importName: `scope${index}`,
      importPath: relativeImport(outputDir, scope.filePath),
      filePath: scope.filePath,
      routePath: scope.routePath,
      segments: scope.segments
    });
  });

  return imports;
}

function renderModule(scanResult, imports, packageName) {
  const routeImports = imports.filter((entry) => entry.kind === 'route');
  const scopeImports = imports.filter((entry) => entry.kind === 'scope');
  const lines = [
    `import { createRoutes, mount } from '${packageName}';`,
    ''
  ];

  for (const entry of imports) {
    lines.push(`import ${entry.importName} from '${entry.importPath}';`);
  }

  lines.push('', 'export default createRoutes({', '  routes: [');

  const routeEntries = routeImports.map((entry) => ({
    ...scanResult.routes.find((route) => route.filePath === entry.filePath),
    importName: entry.importName
  }));
  const scopeEntries = scopeImports.map((entry) => ({
    ...scanResult.scopes.find((scope) => scope.filePath === entry.filePath),
    importName: entry.importName
  }));
  const grouped = routeEntries.filter((route) => shouldGroup(route, routeEntries, scopeEntries));
  const direct = routeEntries.filter((route) => !grouped.includes(route));

  for (const route of direct) {
    lines.push(`    ${route.importName},`);
  }

  const groupNames = Array.from(new Set(grouped.map((route) => route.segments[0]))).sort();
  for (const groupName of groupNames) {
    const routes = grouped.filter((route) => route.segments[0] === groupName);
    const scope = scopeEntries.find((entry) => entry.segments[0] === groupName && entry.segments.length === 1);
    const prefix = `/${groupName}`;
    lines.push('    mount(createRoutes({');
    lines.push(`      prefix: '${prefix}',`);
    if (scope) {
      lines.push(`      hooks: ${scope.importName}.hooks,`);
      lines.push(`      contracts: ${scope.importName}.contracts,`);
      lines.push(`      meta: ${scope.importName}.meta,`);
    }
    lines.push('      routes: [');
    for (const route of routes) {
      lines.push(`        ${route.importName},`);
    }
    lines.push('      ]');
    lines.push('    })),');
  }

  lines.push('  ]', '});', '');
  return lines.join('\n');
}

function shouldGroup(route, allRoutes, scopes) {
  if (route.segments.length < 2 && route.routePath !== `/${route.segments[0]}`) return false;
  const first = route.segments[0];
  if (!first) return false;
  if (scopes.some((scope) => scope.segments[0] === first && scope.segments.length === 1)) return true;
  return allRoutes.filter((candidate) => candidate.segments[0] === first).length > 1;
}

function relativeImport(fromDir, filePath) {
  const relative = path.posix.relative(fromDir, normalizePath(filePath));
  const normalized = relative.startsWith('.') ? relative : `./${relative}`;
  return normalized.replaceAll('\\\\', '/');
}
