# Framework Contract Projection

## Files changed

- `src/kernel/contract-projection.js`
- `src/kernel/route-projection.js`
- `src/index.js`
- `tests/kernel-contract-projection.test.js`
- `tests/kernel-contract-projection-upgrade.test.js`
- `tests/kernel-sigiljs-projection.test.js`
- `tests/kernel-route-projection.test.js`
- `tests/kernel-route-collection-projection.test.js`
- `tests/kernel-projection-metadata-example.test.js`

## Public experimental exports

- `projectContract(contract)`
- `projectRoute(route)`
- `projectRoutes(routesOrCollection)`

These exports are justified because docs, tests, examples, and future tooling need safe ways to inspect contract and route metadata without running user application logic.

No projection API is stable.

## Contract projection shape

`projectContract(contract)` returns:

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

## Generic projections

Generic contracts remain honest and opaque:

- function contracts project as `kind: 'function'` with parse capability and no schema/fields
- parse contracts project as `kind: 'parse'` with parse capability and no schema/fields
- check contracts project as `kind: 'check'` with check capability and no schema/fields
- missing contracts project as `kind: 'none'`
- invalid/unknown contracts project as `kind: 'unknown'`

Projection does not execute function/parse/check logic.

## SigilJS projection

SigilJS contracts project as:

- `kind: 'sigil'`
- `capability: { parse: true, check: true, project: true }`
- `opaque: false`
- `schema`: result of safe SigilJS `toJSONSchema()` when available
- `fields`: safe field summaries when available
- `required`: required field names when available
- `optional`: optional field names when available

Field summaries use a small deterministic shape:

```js
{
  name,
  required,
  kind,
  fields
}
```

Unsupported SigilJS shapes fall back honestly: schema may exist, while field/required/optional metadata can remain `null`.

## Route projection

`projectRoute(route)` summarizes:

- method
- path
- contract boundaries (`params`, `query`, `headers`, `body`, `response`)
- route hook counts
- route metadata

It does not execute handlers, hooks, or contracts.

## Route collection projection

`projectRoutes(routesOrCollection)` supports:

- direct route arrays
- `createRoutes(...)` collections
- `mount(...)` descriptors
- `createApp(...)` app objects with composed routes

It summarizes child routes, scoped contracts, hook counts, prefix metadata, and meta values where present.

## Safety posture

Projection does not execute:

- generic contract logic
- SigilJS validation against fake values
- route handlers
- hooks
- request handling

Projection does not generate OpenAPI, TypeScript, clients, forms, or docs. It only exposes honest metadata for future tooling.

## Generated test examples

Projection tests show a lightweight future-doc/test pattern: use projection metadata to list route paths, contract boundaries, and safe SigilJS field summaries, then separately use route smoke tests to validate runtime behavior.

## Verification

Targeted verification passed during the upgrade:

```bash
bun test tests/kernel-contract-projection-upgrade.test.js tests/kernel-sigiljs-projection.test.js tests/kernel-route-projection.test.js tests/kernel-route-collection-projection.test.js tests/kernel-projection-metadata-example.test.js
```

## Deferred

- OpenAPI generation
- JSON Schema generation expansion beyond safe SigilJS metadata
- TypeScript generation
- client SDK generation
- form/action generation
- route manifest generation
- route IDs/names/source metadata
- CLI/compiler integration
