# Internal Candidate Export Decision

## Files inspected

- `src/index.js`
- `README.md`
- `tests/kernel-router-context.test.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-effect-command-validation.test.js`
- `tests/kernel-effect-error-diagnostics.test.js`
- `tests/kernel-effect-helpers.test.js`
- `tests/kernel-framework-errors.test.js`
- `tests/kernel-result-response.test.js`
- `docs/internal/root-export-usage-audit.md`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `src/index.js`
- `README.md`
- `tests/kernel-router-context.test.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-effect-command-validation.test.js`
- `tests/kernel-effect-error-diagnostics.test.js`
- `tests/kernel-effect-helpers.test.js`
- `tests/kernel-framework-errors.test.js`
- `tests/kernel-result-response.test.js`
- `docs/internal/internal-candidate-export-decision.md`
- `docs/internal/public-preview-api-classification.md`

## Decisions

| Export | Decision | Reason |
| --- | --- | --- |
| `createRequestContext` | internal-only-now | Low-level request context construction is not needed by app authors and may constrain context internals too early. |
| `runEffect` | internal-only-now | Effect execution is an interpreter detail. Users should import `effect`, `call`, `value`, and `context`, not run the interpreter directly. |
| `normalizeFrameworkError` | internal-only-now | Error normalization is boundary infrastructure. Public users can create framework-shaped errors with `createFrameworkError`. |
| `toResponse` | internal-only-now | Response projection is implementation detail behind app routing. Public users should compose `ok`, `fail`, `json`, `text`, and `redirect`. |

## Exports removed from root

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

## Implementation preservation

No implementation behavior was removed. Internal modules still export the helpers for framework internals and tests:

- `src/kernel/context.js`
- `src/kernel/effect.js`
- `src/kernel/error.js`
- `src/kernel/response.js`

## Tests updated

Tests that intentionally exercise internals now import from internal module paths:

- `tests/kernel-router-context.test.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-effect-command-validation.test.js`
- `tests/kernel-effect-error-diagnostics.test.js`
- `tests/kernel-effect-helpers.test.js`
- `tests/kernel-framework-errors.test.js`
- `tests/kernel-result-response.test.js`

## README/API docs updated

README public API status now lists only actual root exports. It notes lower-level implementation helpers remain internal.

`docs/internal/public-preview-api-classification.md` now reflects the pruned root surface.

## Blockers

No blocker. Root export pruning is complete for the four high-risk internal candidates.
