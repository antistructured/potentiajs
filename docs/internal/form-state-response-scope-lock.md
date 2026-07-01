# Form State / Form Response Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/kernel/action.js`
- `src/kernel/diagnostics.js`
- `src/kernel/response.js`
- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-domain-failure.test.js`
- `tests/kernel-action-redirect.test.js`
- `tests/kernel-action-urlencoded-contracts.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`
- `tests/kernel-action-urlencoded-input.test.js`
- `tests/kernel-action-urlencoded-parser.test.js`
- `docs/internal/action-result-redirect-semantics-report.md`
- `docs/internal/field-level-contract-diagnostics-implementation-report.md`
- `docs/internal/forms-progressive-enhancement-decision.md`
- `docs/internal/action-validation-error-shape-decision.md`

## Files changed

- `docs/internal/form-state-response-scope-lock.md`

## Findings

Current action-adjacent behavior is strong enough to design form state without implementing it:

- `action(...)` parses JSON and URL-encoded bodies.
- Parsed action input is assigned to `ctx.input`.
- URL-encoded repeated fields become arrays of strings.
- Empty URL-encoded values remain `''`.
- Dangerous URL-encoded keys are rejected.
- Action input/output contracts are enforced.
- Action input failures return `ok: false`, `error`, `boundary`, and `issues`.
- Issues use the canonical diagnostics shape.
- Raw body/input values are not exposed by diagnostics.
- Domain failures use `fail(...)` and preserve custom error codes.
- Redirects use explicit `redirect(location, status)` and bypass output/route response contracts.
- Action projection/manifest metadata includes content types and progressive-enhancement hints, but no form state model.

## Decisions

This gate is design-only. It may define future policies for:

- failed submission state
- safe submitted value preservation
- issue-to-form-error mapping
- form response envelopes
- redirect-after-post guidance
- domain failure form behavior
- future projection/manifest relationship

This gate must not add:

- source implementation
- public exports
- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file support
- session/flash helpers
- DB/auth
- CLI/compiler
- TypeScript source
- publish prep

## Design placement decision

Future form state should be action-adjacent but not automatic default action behavior. The first implementation should likely be an opt-in helper layered over existing action failure/result responses, not a replacement for `action(...)`, `ok(...)`, `fail(...)`, or `redirect(...)` semantics.

## Deferred

- form state helper implementation
- generated forms
- client enhancement runtime
- session/flash persistence
- multipart/file upload state
- projection/manifest metadata changes
- stable public API commitment

## Blockers

- Submitted value preservation needs explicit safety rules before implementation.
- Form envelopes need compatibility boundaries so existing action response shapes are not silently changed.
- Session/flash behavior must stay deferred until a storage/cookie policy exists.
