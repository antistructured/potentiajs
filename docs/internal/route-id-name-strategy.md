# Route ID / Name Strategy

## Files inspected

- `src/kernel/route.js`
- `src/kernel/route-projection.js`
- `docs/internal/route-metadata-shape.md`

## Files changed

- `src/kernel/route-id.js`
- `src/kernel/route-manifest.js`
- `src/kernel/route-projection.js`
- `tests/kernel-route-id-strategy.test.js`
- `docs/internal/route-id-name-strategy.md`

## Behavior added

Deterministic route IDs are generated from method and normalized path:

```txt
METHOD /normalized/path
```

Examples:

- `GET /`
- `GET /users/:id`
- `POST /users`

`projectRoute()` now includes `id` and optional `name`.

## Helpers

Internal module helpers:

- `createRouteId(route)`
- `normalizeRoutePath(path)`

They are intentionally not exported from the package root.

## Normalization rules

- method is uppercased
- duplicate path slashes are collapsed
- trailing slash is removed except for root
- invalid route input returns `null`

## Scope boundary

Uniqueness is not enforced here. Duplicate route IDs/names are handled by manifest diagnostics.

## Verification

```bash
bun test tests/kernel-route-id-strategy.test.js tests/kernel-route-projection.test.js
```

Result:

- 15 pass
- 0 fail

## Blockers

- IDs are deterministic but not stable API yet.
- Explicit custom route IDs remain deferred; current default is method/path only.
