# Action Primitive Foundation Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- action foundation scope lock
- experimental `action()` primitive
- direct explicit route delivery
- JSON action input parsing
- `ctx.input`
- action input contracts
- action output contracts
- action-specific safe error diagnostics
- `projectAction()`
- route projection action metadata
- route manifest action bridge
- focused action example
- README/docs/package hygiene updates

Not performed:

- URL-encoded form parsing in the original action primitive foundation block itself; added later by the URL-encoded action input block
- multipart/file upload support
- form generator
- frontend runtime
- client SDK
- OpenAPI
- action auto-routing
- hidden RPC transport
- CLI/compiler integration
- DB/auth
- publish prep
- TypeScript conversion

## 4. New/changed exports

Added experimental root exports:

- `action`
- `projectAction`

No API is stable.

## 5. Action behavior

`action(id, handler, options)` creates a deterministic descriptor:

```js
{
  kind: 'action',
  id,
  handler,
  input,
  output,
  meta,
  source
}
```

Actions can be delivered explicitly through routes:

```js
route('POST', '/users', createUser)
```

No auto-routing or hidden RPC transport was added.

## 6. JSON input / `ctx.input`

Action routes parse JSON request bodies and attach validated/prepared input to:

```js
ctx.input
```

Supported now:

- `application/json`
- `application/json; charset=utf-8`
- missing content type with valid JSON body

Empty body gives `ctx.input = null`.

## Addendum — URL-Encoded Form Action Input

The follow-up URL-encoded action input block added `application/x-www-form-urlencoded` support to the same action input boundary.

Current action input support now includes:

- `application/json`
- `application/json; charset=utf-8`
- `application/x-www-form-urlencoded`
- `application/x-www-form-urlencoded; charset=utf-8`

URL-encoded values remain strings until contracts transform them. Repeated fields become arrays of strings. Dangerous keys are rejected to prevent prototype pollution.

## 7. Contract behavior

Action execution order:

1. route params/query/header contracts
2. action JSON input parsing
3. optional route body contract against parsed JSON
4. action input contract
5. action handler
6. action output contract against logical response body
7. route response contract
8. response projection

Supported contract styles:

- generic function
- `{ parse(value) }`
- `{ check(value) }`
- SigilJS

Native `Response` output validation remains deferred.

## 8. Error behavior

Added action-specific framework codes:

- `POTENTIA_ACTION_INPUT_FAILED`
- `POTENTIA_ACTION_OUTPUT_FAILED`
- `POTENTIA_ACTION_HANDLER_FAILED`

Failure mapping:

- malformed JSON → `400` / `POTENTIA_ACTION_INPUT_FAILED`
- input contract failure → `400` / `POTENTIA_ACTION_INPUT_FAILED`
- output contract failure → `500` / `POTENTIA_ACTION_OUTPUT_FAILED`
- thrown action handler error → `500` / `POTENTIA_ACTION_HANDLER_FAILED`

Unsafe handler details are hidden.

## 9. Projection / manifest behavior

`projectAction(action)` projects:

- id
- input contract metadata
- output contract metadata
- source
- meta

`projectRoute(...)` detects action handlers and includes `action` metadata.

`createRouteManifest(...)` includes top-level `actions` for action routes with route linkage and supported action content type metadata.

## 10. Example behavior

Added `examples/action-basic/` demonstrating:

- `action()`
- JSON input
- `ctx.input`
- SigilJS input/output contracts
- explicit route delivery
- `effect(...)` and `call(...)`
- deterministic validation failure

## 11. Tests added/updated

Added:

- `tests/kernel-action-shape.test.js`
- `tests/kernel-action-input.test.js`
- `tests/kernel-action-contracts.test.js`
- `tests/kernel-action-errors.test.js`
- `tests/kernel-action-projection.test.js`
- `tests/action-basic-example.test.js`

Updated:

- `tests/kernel-route-projection.test.js`

## 12. Package hygiene

The action example is intentionally included in package files.

No generated artifacts, tests, or `docs/internal/` should ship in the package.

## 13. Recommendation

Next best block: **URL-Encoded Form Action Input**, if forms/actions continue before publish prep.

Keep the next block narrow: URL-encoded parsing, scalar field policy, action input contract reuse, no form generator, no multipart.
