# Field-Level Contract Diagnostics Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/kernel/contract.js`
- `src/kernel/contract-projection.js`
- `src/kernel/action.js`
- `src/kernel/error.js`
- `src/kernel/route-projection.js`
- `src/kernel/action-projection.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-urlencoded-errors.test.js`
- `tests/kernel-action-errors.test.js`
- `docs/internal/contract-projection-upgrade-report.md`
- `docs/internal/action-result-redirect-semantics-report.md`
- `docs/internal/action-validation-failure-shape.md`
- `docs/internal/action-urlencoded-contract-error-behavior.md`

## Files changed

- `docs/internal/field-diagnostics-scope-lock.md`

## Current issue shape

Current route contract diagnostics expose a small safe issue object:

```js
{ message: 'SigilJS contract rejected value' }
```

or generic equivalents:

```js
{ message: 'Contract check returned false' }
{ message: 'Contract parser rejected value' }
```

Current action diagnostics preserve that same issue array and additionally expose form-friendly action-level metadata:

```js
{
  ok: false,
  error: { code, message, boundary, issues },
  boundary,
  issues
}
```

Current issues do not carry canonical `path`, `field`, `code`, `source`, `expected`, `received`, or `meta` fields.

## Current route contract diagnostic behavior

Route contract boundaries are:

- `params`
- `query`
- `headers`
- `body`
- `response`

Request-side failures return `400`; response contract failures return `500`.

Route diagnostics are safe and deterministic but not field-addressable yet.

## Current action diagnostic behavior

Action boundaries are:

- `input`
- `output`
- `handler`

Action input failures return `400`; action output and handler failures return safe `500` responses.

Action validation failure responses already include top-level `ok: false`, `boundary`, and `issues`, but the issue objects themselves remain coarse.

## Current SigilJS exposure

Installed `@weipertda/sigiljs@0.18.0` exposes structured validation error fields in declarations/source:

- `code: 'SIGIL_VALIDATION_FAILED'`
- `message`
- `path`
- `expected`
- `actual`

Potentia currently collapses SigilJS failures to `{ message: 'SigilJS contract rejected value' }` for safety.

SigilJS projection already exposes safe field metadata from `describe()` / `toJSONSchema()` where available. Projection metadata is static; runtime validation issues are still not normalized.

## Future normalization location

Future implementation should introduce an internal issue normalization utility near contract failure construction, likely under `src/kernel/contract.js` or a small adjacent internal module.

The utility should be called by route contract failures and action input/output failures so both surfaces share one canonical issue model.

## Scope decisions

This block is a design gate only.

Allowed:

- internal docs
- README honesty update
- final verification

Not allowed in this block:

- source implementation
- new public exports
- changed runtime behavior
- new tests that assert unimplemented behavior
- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file upload support
- session/flash helpers
- DB/auth
- CLI/compiler expansion
- TypeScript conversion
- publish prep

## Blockers

- SigilJS exposes structured error fields for a single validation error shape, but Potentia still needs to verify every relevant SigilJS failure mode before trusting field-level data.
- Generic contracts are opaque and cannot honestly produce field paths unless a future explicit issue protocol is designed.
- Route error bodies and action error bodies are currently not fully identical; consistency should be designed before implementation.
