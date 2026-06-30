# Route Manifest Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `src/kernel/route-projection.js`
- `src/kernel/contract-projection.js`
- `tests/kernel-route-projection.test.js`
- `tests/kernel-route-collection-projection.test.js`
- `tests/kernel-projection-metadata-example.test.js`
- `docs/internal/contract-projection-upgrade-report.md`
- `docs/internal/route-projection-model.md`
- `docs/internal/route-collection-projection-model.md`

## Findings

Current route descriptors are stable objects with:

- `method`
- `path`
- `handler`
- `options`
- `pattern`

Current route options already carry contract boundaries and can safely carry additional descriptive metadata without changing matching or execution behavior.

Current projection helpers can describe:

- route methods and paths
- route contract boundaries
- scoped contract defaults
- hook counts
- route/collection metadata

Missing manifest foundations:

- route IDs
- optional route names
- source metadata
- deterministic manifest shape
- manifest diagnostics
- manifest lookup tables

## Decisions

Route metadata fits existing route options:

```js
route('GET', '/users/:id', handler, {
  name: 'users.show',
  meta: { description: 'Fetch user' },
  source: { file: 'routes/users/[id].js', line: null, column: null }
});
```

Route behavior must remain unchanged. Metadata is descriptive only.

Default route IDs should be generated from normalized method/path:

```txt
METHOD PATH
```

Examples:

- `GET /`
- `GET /users/:id`
- `POST /users`

Route names are optional and projected when present.

Source metadata is accepted now only when explicitly provided. No filesystem inference or source line detection is in scope.

Add one public experimental manifest API:

- `createRouteManifest(input, options)`

Keep any lower-level ID helpers internal.

## Explicitly deferred

- OpenAPI generation
- JSON Schema expansion
- TypeScript generation
- client SDK generation
- forms/actions generation
- frontend runtime
- file-routing scanner changes
- route manifest file writing
- CLI expansion
- compiler integration
- runtime router lookup replacement
- publish prep
- public API stabilization

## Safety rules

Manifest creation may inspect descriptors and projection metadata. It must not execute:

- route handlers
- hooks
- generic contracts
- request handling code
- runtime filesystem imports

## Blockers

- All manifest APIs remain experimental.
- Duplicate route IDs/names should be reported deterministically in manifest diagnostics rather than silently fixed.
- Manifest shape is a foundation for future tooling, not a generator output format commitment.
