export function createRouteId(value) {
  if (!value || typeof value !== 'object') return null;
  if (typeof value.method !== 'string' || typeof value.path !== 'string') return null;

  return `${String(value.method).toUpperCase()} ${normalizeRoutePath(value.path)}`;
}

export function normalizeRoutePath(path) {
  const normalized = `/${String(path || '').split('/').filter(Boolean).join('/')}`;
  return normalized === '' ? '/' : normalized;
}
