# Contract Projection Upgrade Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/contract-projection.js`
- `src/kernel/contract.js`
- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `src/kernel/app.js`
- `tests/kernel-contract-projection.test.js`
- `docs/internal/framework-contract-projection.md`
- `docs/internal/effect-dx-helpers-report.md`
- `docs/internal/kernel-public-export-pruning-review.md`
- live `@weipertda/sigiljs@0.18.0` metadata probe

## Findings

Current `projectContract()` is intentionally minimal:

```js
{
  kind,
  capabilities,
  schema
}
```

Current generic behavior:

- function contracts project as `generic-function` with `parse` capability and no schema
- `{ parse(value) }` contracts project as `generic-parse` with `parse` capability and no schema
- `{ check(value) }` contracts project as `generic-check` with `check` capability and no schema
- generic projection does not execute user logic

Current SigilJS behavior:

- native SigilJS contracts are recognized by `normalizeContract()`
- projection can safely call `toJSONSchema()`
- live `@weipertda/sigiljs@0.18.0` contracts expose `ast` and `describe()` metadata
- object contract `describe()` includes property keys, required/optional status, and primitive/nested contract summaries
- object contract `toJSONSchema()` includes object `properties` and `required` arrays

Current route/collection behavior:

- `route()` returns stable route descriptors with `method`, `path`, `handler`, `options`, and `pattern`
- `createRoutes()` returns stable collections with `kind`, `prefix`, `routes`, `hooks`, `contracts`, and `meta`
- `mount()` returns stable mount descriptors
- `composeRoutes()` produces effective cloned routes with scoped contracts/hooks applied

## Decisions

Upgrade `projectContract()` to a richer deterministic shape while preserving backward-compatible fields where possible:

- keep `kind`
- keep `capabilities`
- keep `schema`
- add `capability`
- add `opaque`
- add `fields`
- add `required`
- add `optional`
- add `meta`

Use honest opaque projection for generic contracts. Generic function/parse/check contracts must never claim field-level shape unless explicit metadata exists without running user logic.

Enrich SigilJS projection only from safe static metadata:

- `toJSONSchema()`
- `describe()`
- `ast`

Add route projection as a public experimental helper because it composes directly with existing public `route()`/`projectContract()` and is useful for tests/docs/future tooling:

- `projectRoute(route)`

Add route collection/app projection as a public experimental helper because it composes route arrays, `createRoutes(...)`, `mount(...)`, and app `.routes` output without executing handlers/hooks/contracts:

- `projectRoutes(routesOrCollection)`

Do not stabilize any projection APIs.

## Explicitly deferred

- OpenAPI generation
- JSON Schema generator expansion beyond safe available metadata
- TypeScript generation
- client SDK generation
- forms/actions generation
- frontend runtime
- database schemas
- auth policy projection
- CLI expansion
- compiler integration
- file manifest generation
- publish prep
- TypeScript source conversion
- field-level verbose validation issue projection

## Safety rules

Projection must not execute:

- generic contract functions
- generic `parse()` functions
- generic `check()` functions
- route handlers
- hooks
- runtime request code

Projection may read static descriptor objects and safe SigilJS metadata methods.

## Blockers

- SigilJS metadata availability is version-specific; fallback projection must stay honest if shape metadata is unavailable.
- Route collection projection can summarize existing descriptors, but it is not a route manifest or generator.
- No projection API is stable.
