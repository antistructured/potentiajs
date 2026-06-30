import { FILE_ROUTE_DIAGNOSTIC_CODES } from './path-mapping.js';

export function routeCollisionDiagnostics(routes) {
  const byPath = new Map();

  for (const route of routes) {
    const existing = byPath.get(route.routePath) || [];
    existing.push(route);
    byPath.set(route.routePath, existing);
  }

  const collisions = [];
  for (const [routePath, entries] of byPath.entries()) {
    if (entries.length < 2) continue;
    collisions.push({
      code: FILE_ROUTE_DIAGNOSTIC_CODES.COLLISION,
      message: 'Multiple route files map to the same route path',
      routePath: routePath,
      files: entries.map((entry) => entry.filePath).sort()
    });
  }

  return collisions.sort((a, b) => a.routePath.localeCompare(b.routePath));
}
