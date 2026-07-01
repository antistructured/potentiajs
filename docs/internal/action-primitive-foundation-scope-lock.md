# Action Primitive Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/error.js`
- `src/kernel/response.js`
- `src/kernel/result.js`
- `docs/internal/contract-native-forms-actions-design-gate-report.md`
- `docs/internal/action-boundary-model-decision.md`
- `docs/internal/action-input-parsing-decision.md`
- `docs/internal/action-validation-error-shape-decision.md`
- `docs/internal/action-manifest-projection-decision.md`
- `docs/internal/route-metadata-manifest-foundation-report.md`

## Scope

This block implements the smallest useful contract-native server action primitive.

In scope:

- experimental `action(id, handler, options)`
- direct explicit route delivery via `route('POST', '/path', action(...))`
- JSON request input only
- `ctx.input`
- action input contract
- action output contract
- action-specific safe error codes
- action projection metadata
- route manifest action bridge if small and deterministic
- focused example/docs/tests/package hygiene

Out of scope:

- form generation
- URL-encoded forms
- multipart parsing
- file uploads
- frontend runtime
- browser helpers
- client SDK
- OpenAPI
- action auto-routing
- hidden RPC transport
- CLI expansion
- compiler integration
- database/auth
- TypeScript conversion
- publish prep

## Findings

Current primitives support a narrow action implementation:

- Route handlers already accept non-function descriptors because `runEffect(...)` receives route `handler` values.
- `effect(...)` already supports generator/async/plain action workflows.
- `ok(...)` / `fail(...)` and response descriptors already normalize through `toResponse(...)`.
- Contract helpers can validate generic, parse/check, and SigilJS contracts.
- `responseBody(...)` / `replaceResponseBody(...)` can validate logical output before final response projection.
- `projectContract(...)`, `projectRoute(...)`, and `createRouteManifest(...)` provide a safe metadata path for action projection.

## Decisions

`action()` should live in `src/kernel/action.js` and be exported experimentally from `src/index.js`.

Actions should be descriptor objects, not hidden route registrations. The app runtime should detect action descriptors and execute them through a dedicated action path while preserving existing non-action route behavior.

Initial action input support is JSON only:

- `application/json`
- `application/json; charset=utf-8`
- missing content type is accepted only when a body exists and contains valid JSON
- empty/missing body becomes `ctx.input = null`

Malformed JSON maps to `POTENTIA_ACTION_INPUT_FAILED` with status `400`.

Action contract order:

1. route params/query/headers contracts
2. action JSON input parsing
3. optional route body contract against the same parsed JSON, if present
4. action input contract to produce `ctx.input`
5. action handler through existing effect model
6. action output contract against logical response body
7. route response contract
8. response projection

`projectAction(action)` is justified now because manifest/projected metadata should include action IDs and contract projections without executing handlers/contracts.

Manifest bridge is justified if action handlers are discoverable from route descriptors. It should add top-level `actions` while preserving existing `routes` behavior.

## Deferred

- `form()`
- URL-encoded form parsing
- multipart/file upload semantics
- client validation/runtime helpers
- form/client/docs/OpenAPI generators
- action auto-routing
- RPC endpoint discovery
- manifest file output/loading
- stable API commitments

## Blockers

- Field-level action issues remain limited by current sanitized contract diagnostics.
- Native `Response` output validation is skipped unless a later block designs response cloning/body extraction.
- URL-encoded form support requires repeated/nested field policy before implementation.
