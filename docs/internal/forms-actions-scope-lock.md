# Forms / Actions Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/effect.js`
- `src/kernel/route.js`
- `src/kernel/route-projection.js`
- `src/kernel/route-manifest.js`
- `examples/`
- `tests/`
- `docs/internal/route-metadata-manifest-foundation-report.md`
- `docs/internal/contract-projection-upgrade-report.md`
- `docs/internal/framework-effect-model.md`
- `docs/internal/framework-contract-boundary-model.md`
- `docs/internal/route-manifest-projection.md`

## Scope

This is a design gate only. It records decisions for future contract-native forms and actions without changing runtime behavior.

In scope:

- action boundary philosophy
- server action model
- form contract model
- input parsing order
- route/action relationship
- validation/error response shape
- progressive enhancement stance
- client-side projection boundary
- effect integration
- manifest/projection integration
- future implementation pass sequence

Out of scope:

- source implementation
- new public exports
- form generation
- frontend runtime
- client SDK generation
- OpenAPI generation
- file uploads implementation
- multipart parser implementation
- database integration
- auth implementation
- CLI expansion
- compiler integration
- publish prep
- TypeScript conversion

## Findings

Current primitives that can support future actions:

- `route(method, path, handler, options)` already accepts route handlers and metadata.
- `runEffect(...)` already executes plain functions, async functions, and `effect(...)` descriptors.
- `ok(...)` / `fail(...)` already provide a framework result shape.
- Contract boundaries already validate `params`, `query`, `headers`, `body`, and `response`.
- `projectContract(...)` can project safe SigilJS metadata without executing generic contracts.
- `projectRoute(...)`, `projectRoutes(...)`, and `createRouteManifest(...)` can describe routes without executing handlers/hooks/contracts.
- Route manifests already include deterministic route IDs, names, source/meta, contracts, hooks, diagnostics, and lookups.

Current gaps:

- no action descriptor exists
- no action input/output contract boundary exists
- no `ctx.input` convention exists
- no form data parsing model exists
- no action-specific validation/error shape exists
- no progressive enhancement contract exists
- no action manifest section exists

## Decisions

Actions should be designed as projections of existing Potentia primitives, not as a separate RPC architecture.

The intended hierarchy remains:

```txt
SigilJS contract
↓
action input/output boundary
↓
effectful server workflow
↓
route delivery
↓
manifest/projection metadata
↓
future form/client/docs generation
```

The first implementation should prefer an `action(...)` primitive over a `form(...)` primitive. Forms should initially be a future projection from contracts/actions/manifests rather than a runtime architecture.

Future action design should preserve:

- server-authoritative validation
- explicit routes
- explicit effects
- existing result/response normalization
- no frontend framework lock-in
- no hidden RPC transport
- no client validation trust boundary

## Deferred features

- `action()` implementation
- `form()` implementation
- generated forms
- client SDKs
- OpenAPI
- frontend runtime/hydration
- multipart/file uploads
- action manifest implementation
- CLI/compiler integration
- publish prep

## Blockers

- No public API is stable.
- Input parsing/error semantics must be decided before implementation.
- The future action model must not break route handler compatibility.
- Plain HTML form support requires URL-encoded parsing decisions before implementation.
