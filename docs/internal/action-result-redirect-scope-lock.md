# Action Result / Redirect Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/action.js`
- `src/kernel/response.js`
- `src/kernel/result.js`
- `src/kernel/error.js`
- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-action-*.test.js`
- `examples/action-basic/`
- `docs/internal/action-primitive-foundation-report.md`
- `docs/internal/action-urlencoded-input-report.md`
- `docs/internal/action-validation-error-shape-decision.md`
- `docs/internal/forms-progressive-enhancement-decision.md`

## Findings

Actions already project through the existing Potentia response model. Action handlers can return `ok(...)`, `fail(...)`, response descriptors, plain values, native `Response`, or throw errors. The current action runtime only needs stronger tests/docs and a small redirect/output-contract policy hardening.

Current behavior before this block:

- action success can return `ok(json(...))` or plain values through `toResponse(...)`
- action failures use `fail(...)` and safe framework errors
- native `Response` bypasses action output validation
- redirect descriptors are normal response descriptors but action output contracts currently try to validate their `null` body
- validation failure bodies expose `{ error: { code, message, boundary, issues } }` but do not include `ok: false` or top-level `boundary`/`issues`

## Decisions

No new action-specific result helper is necessary in this block. Existing helpers remain the action result language:

- `ok(...)` for success
- `fail(...)` for intentional failure
- `redirect(...)` for explicit redirects
- `json(...)` / `text(...)` / native `Response` for response projection

A tiny compatibility improvement to `fail(error, status)` is justified because it makes intentional domain failures concise while still producing a normal Potentia result.

Redirects should remain explicit via existing `redirect(location, status)`.

Action output contracts should validate logical action values but bypass native `Response` and redirect descriptors/results. Route response contracts should follow the same redirect bypass policy.

Validation failure responses should become more form-friendly by adding deterministic top-level metadata while preserving existing error details:

- `ok: false`
- `error.code`
- `error.message`
- `boundary`
- `issues`

## Deferred

- form generator
- frontend/client helpers
- OpenAPI/client SDK
- multipart/file uploads
- field-level diagnostic overhaul
- session flashing
- automatic cookie/session state
- implicit redirects
- action result envelope negotiation
- localization
- domain error class hierarchy
- DB/auth
- CLI/compiler
- publish prep

## Blockers

- Field-level issue paths remain limited by current contract diagnostics.
- Form state preservation needs a separate action result/envelope design.
- Redirect-after-action patterns are explicit only; no session flash or auto-redirect policy exists.
