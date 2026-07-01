# Field-Level Contract Diagnostics Implementation Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- internal canonical issue normalization utility
- path-to-field derivation
- safe received-value descriptors
- SigilJS structured issue normalization
- generic opaque fallback issues
- route/action diagnostic envelope alignment
- safety/regression tests
- README/internal docs/package hygiene checks

Not performed:

- custom generic issue protocol
- projection/manifest diagnostics metadata
- form state preservation
- session/flash helpers
- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file upload support
- DB/auth
- CLI/compiler
- publish prep
- TypeScript conversion
- public API stabilization

## 4. Issue normalization behavior

Added internal `src/kernel/diagnostics.js`.

Canonical issues include:

```js
{
  code,
  message,
  path,
  field,
  boundary,
  source,
  expected,
  received,
  meta
}
```

Paths are normalized arrays. `field` is derived from path:

- `['email']` → `email`
- `['profile', 'name']` → `profile.name`
- `['tags', 0]` → `tags[0]`
- `[]` → `null`

Invalid path segments are dropped deterministically.

## 5. SigilJS issue behavior

SigilJS validation failures with `SIGIL_VALIDATION_FAILED` now normalize structured fields:

- `path`
- `expected`
- `actual`

Normalized issues use:

- `source: 'sigil'`
- safe path/field data where available
- safe `expected`
- safe `received` type descriptor

Raw `actual` values are not exposed.

If structured data is unavailable, Potentia falls back to a root-level SigilJS issue.

## 6. Generic fallback behavior

Generic contracts remain opaque.

Function/parse failures produce root-level `parse_failed` issues.

Check failures produce root-level `check_failed` issues.

Thrown generic messages are not exposed.

No custom generic issue protocol was added.

## 7. Route/action envelope behavior

Contract failures with diagnostics now use:

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

Nested `error.boundary` and `error.issues` compatibility remains.

Status mapping remains:

- request/input failures: `400`
- response/output failures: `500`
- handler failures: `500`

Non-diagnostic framework errors such as 404/405 retain their simple error body shape.

## 8. Safety behavior

Tests verify that diagnostics do not expose:

- raw email-like inputs
- raw object input
- raw array input
- raw URL-encoded body text
- thrown generic contract messages
- thrown handler messages
- dangerous form keys

`received` uses safe descriptors such as `string`, `number`, `array`, `object`, `null`, or `undefined`.

## 9. Tests added/updated

Added:

- `tests/kernel-field-issue-normalization.test.js`
- `tests/kernel-sigiljs-field-diagnostics.test.js`
- `tests/kernel-generic-contract-field-diagnostics.test.js`
- `tests/kernel-route-contract-diagnostic-envelope.test.js`
- `tests/kernel-action-diagnostic-envelope.test.js`
- `tests/kernel-field-diagnostics-safety.test.js`
- `tests/kernel-field-diagnostics-regression.test.js`

Updated existing diagnostics/error-shape tests to expect canonical issues while preserving compatibility fields.

## 10. Deferred features

- custom generic issue protocol
- projection/manifest diagnostics metadata
- form state preservation
- session flash
- form generator
- frontend runtime
- client SDK/OpenAPI
- multipart/file validation
- stable public API commitment
- publish prep

## 11. Recommendation

Next best block: **Form State / Form Response Design Gate** if forms/actions continue before publish prep.

Keep it design-only unless explicitly promoted: safe submitted value preservation policy, validation issue mapping, redirect-after-post policy, no form generator/frontend/client SDK yet.
