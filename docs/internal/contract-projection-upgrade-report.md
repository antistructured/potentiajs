# Contract Projection Upgrade Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- projection upgrade scope lock
- richer `projectContract()` metadata
- honest opaque generic projection
- SigilJS projection enrichment from safe metadata
- route projection
- route collection/app projection
- projection metadata example tests
- README/internal docs updates
- package hygiene checks

Not performed:

- OpenAPI generation
- JSON Schema generator expansion beyond safe metadata
- TypeScript generation
- client SDK generation
- forms/actions generation
- frontend work
- database/auth projection
- CLI/compiler integration
- publish prep
- TypeScript source conversion

## 4. New/changed exports

Changed existing experimental export:

- `projectContract`

Added experimental root exports:

- `projectRoute`
- `projectRoutes`

No exports were removed. No projection API is stable.

## 5. Contract projection behavior

`projectContract()` now returns:

```js
{
  kind,
  capabilities,
  capability,
  opaque,
  schema,
  fields,
  required,
  optional,
  meta
}
```

Generic contracts remain opaque and are never executed during projection.

## 6. SigilJS projection behavior

SigilJS projection uses safe metadata from SigilJS:

- `toJSONSchema()`
- `describe()`
- schema fallback data

Object contracts can project:

- schema
- field summaries
- required field names
- optional field names
- primitive field kinds
- nested object field summaries

Unsupported shapes fall back honestly with `fields`, `required`, and `optional` as `null` where metadata is not available.

## 7. Route projection behavior

`projectRoute(route)` projects:

- method
- path
- contract boundaries
- hook counts
- metadata

It does not execute handlers, hooks, or contracts. Invalid input projects deterministically as `unknown-route`.

## 8. Route collection projection behavior

`projectRoutes(routesOrCollection)` supports:

- route arrays
- `createRoutes(...)`
- `mount(...)`
- `createApp(...)` app objects

It projects child routes, scoped contracts, hook summaries, prefix metadata, and metadata without executing handlers/hooks/contracts.

## 9. Example/test metadata behavior

`tests/kernel-projection-metadata-example.test.js` demonstrates using projection metadata from the composed example app to list:

- route methods and paths
- contract boundaries
- scoped defaults
- safe SigilJS fields
- hook counts

No docs generator, client generator, or OpenAPI generator was added.

## 10. Deferred features

- OpenAPI generation
- JSON Schema generator expansion
- TypeScript generation
- client SDKs
- forms/actions
- route IDs/names/source metadata
- generated manifests
- route lookup metadata
- compiler/CLI integration
- publish prep

## 11. Tests added/updated

Added:

- `tests/kernel-contract-projection-upgrade.test.js`
- `tests/kernel-sigiljs-projection.test.js`
- `tests/kernel-route-projection.test.js`
- `tests/kernel-route-collection-projection.test.js`
- `tests/kernel-projection-metadata-example.test.js`

Updated:

- `tests/kernel-contract-projection.test.js`

## 12. Recommendation

Next best block: **Route Metadata / Manifest Foundation**, if publish decisions remain deferred and projection should keep improving.

Projection is now useful enough for docs/tests/future tooling while still obeying the projection law: never claim more than static metadata can prove.
