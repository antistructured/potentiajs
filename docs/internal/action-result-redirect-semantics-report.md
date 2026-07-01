# Action Result / Redirect Semantics Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- result/redirect scope lock
- action result compatibility review
- explicit redirect semantics
- deterministic validation failure shape
- domain failure convention via `fail(...)`
- action result projection/manifest semantics
- action example update
- README/internal docs/package hygiene checks

Not performed:

- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file upload support
- field-level diagnostic overhaul
- session flashing
- implicit redirects
- DB/auth
- CLI/compiler
- publish prep
- TypeScript conversion

## 4. Result compatibility

Actions use existing Potentia result/response primitives:

- `ok(json(value))`
- `ok(text(value))`
- `fail(error)`
- `fail(error, status)` for intentional domain failures
- plain object
- string
- `null` / `undefined`
- native `Response`

No new `actionOk(...)`, `actionFail(...)`, or `actionRedirect(...)` helper was added.

## 5. Redirect semantics

Actions redirect explicitly with existing `redirect(location, status)`.

- default status: `302`
- custom status supported, e.g. `303`
- empty response body
- works after JSON and URL-encoded submissions

Action output contracts and route response contracts bypass redirects.

## 6. Validation failure shape

Validation and safe framework failures now include form-friendly top-level metadata:

```js
{
  ok: false,
  error: {
    code,
    message,
    boundary,
    issues
  },
  boundary,
  issues
}
```

Nested `error.boundary` and `error.issues` are preserved for compatibility.

Input failures return `400`; output failures remain safe `500`; handler failures remain safe `500` with unsafe details hidden.

## 7. Domain failure convention

Intentional business/domain failures use:

```js
return fail({
  code: 'USER_EMAIL_TAKEN',
  message: 'Email is already in use'
}, 409);
```

Custom domain codes are preserved. Domain failures are distinct from thrown unsafe errors.

Action output contracts do not run for failed action results.

## 8. Projection / manifest semantics

`projectAction(...)` and manifest action entries include:

```js
result: {
  success: 'response-projection',
  validationFailure: 'action-input-failed',
  redirect: 'explicit',
  domainFailure: 'fail-result'
}
```

Projection remains static and does not execute handlers or contracts.

## 9. Example behavior

`examples/action-basic/` now demonstrates:

- successful JSON action
- successful URL-encoded action
- validation failure
- domain failure
- redirect after successful action

No form helper/frontend/client/OpenAPI scope was added.

## 10. Tests added/updated

Added:

- `tests/kernel-action-result-compatibility.test.js`
- `tests/kernel-action-redirect.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-domain-failure.test.js`
- `tests/kernel-action-result-projection.test.js`

Updated:

- action error/contract tests for expanded error body
- `tests/action-basic-example.test.js`
- `tests/kernel-action-projection.test.js`

## 11. Package hygiene

No new dependencies or package split were added. Internal docs/tests remain repo-only and excluded from pack output.

## 12. Deferred features

- field-level contract diagnostics
- action result envelope negotiation
- form state preservation
- session flash helpers
- form generator
- client SDK/OpenAPI
- multipart/file uploads

## 13. Recommendation

Next best block: **Field-Level Contract Diagnostics Design Gate** if forms/actions continue before publish prep.

Keep it design-first: issue normalization, SigilJS issue extraction, generic fallback, route/action consistency, no frontend/form generator yet.
