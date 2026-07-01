# Field Diagnostics Implementation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/kernel/contract.js`
- `src/kernel/error.js`
- `src/kernel/action.js`
- `src/kernel/response.js`
- `src/kernel/app.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`
- `tests/kernel-action-errors.test.js`
- `docs/internal/field-level-contract-diagnostics-design-gate-report.md`
- `docs/internal/field-diagnostics-issue-shape-decision.md`
- `docs/internal/sigiljs-field-issue-extraction-decision.md`
- `docs/internal/generic-contract-issue-fallback-decision.md`
- `docs/internal/route-action-diagnostics-consistency-decision.md`

## Files changed

- `docs/internal/field-diagnostics-implementation-scope-lock.md`

## Findings

Current contract issues are small message-only objects. Route errors currently expose nested `error.boundary` and `error.issues`; action-shaped errors also expose top-level `ok: false`, `boundary`, and `issues`.

`src/kernel/contract.js` is the central place where contract failures become framework errors. It currently owns SigilJS/generic fallback issue creation through `safeContractIssues(...)`.

`src/kernel/response.js` owns public error response shape and is the right place to align top-level route/action envelopes when details include contract boundary/issue metadata.

`src/kernel/action.js` owns action parser errors and action handler failure details. Parser errors should use canonical framework-source issues without exposing raw body data.

SigilJS exposes structured validation fields (`path`, `expected`, `actual`), but implementation must treat `actual` as a possible raw value and convert it to a safe received descriptor.

## Scope decisions

This block may add an internal diagnostics module and wire it into contract/action/response behavior.

This block must not add:

- public root exports
- custom generic issue protocol
- projection/manifest diagnostics metadata
- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file support
- DB/auth
- CLI/compiler expansion
- TypeScript source
- publish prep

## Compatibility posture

Existing nested `error.boundary` and `error.issues` must remain. Route contract failures may gain top-level `ok: false`, `boundary`, and `issues` because this was explicitly accepted by the design gate while APIs remain experimental.

Non-contract errors such as 404/405 and explicit safe framework errors should not be widened unless they carry diagnostic details.

## Deferred

- custom generic issue protocol
- manifest/projection diagnostics metadata
- localization
- form state preservation
- form generator/client SDK/OpenAPI
- stable public API commitment

## Blockers

- Existing tests that assert exact old issue objects will need focused updates to the canonical issue shape.
- SigilJS may not provide nested/array field paths for every shape; implementation must fall back honestly rather than inventing metadata.
