export function createRequestContext(request, match, appState = null) {
  const url = new URL(request.url);

  return {
    request: request,
    method: request.method,
    url: url,
    path: url.pathname,
    params: match.params || {},
    query: queryObject(url.searchParams),
    headers: headersObject(request.headers),
    body: null,
    route: match.route,
    state: appState
  };
}

function queryObject(searchParams) {
  const grouped = {};

  for (const key of Array.from(searchParams.keys()).sort()) {
    const values = searchParams.getAll(key);
    grouped[key] = values.length > 1 ? values : values[0];
  }

  return grouped;
}

function headersObject(headers) {
  const plain = {};

  for (const [key, value] of Array.from(headers.entries()).sort(([a], [b]) => a.localeCompare(b))) {
    plain[key.toLowerCase()] = value;
  }

  return plain;
}
