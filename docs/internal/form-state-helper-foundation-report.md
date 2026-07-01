# Form State Helper Foundation Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Implemented the first opt-in form state helper foundation:

- safe parsed-value preservation
- sensitive field omission
- dangerous key protection
- issue-to-error-map grouping
- `createFormState(...)` envelope helper
- `fail(createFormState(...), status)` response support
- form-state action example
- README/API classification updates

## 4. New/changed exports

New experimental root export:

- `createFormState`

Internal module helpers are available from `src/kernel/form-state.js` for tests/implementation, but they are not root exports:

- `preserveFormValues`
- `groupIssuesByField`

## 5. Safe value preservation behavior

`preserveFormValues(...)` preserves parsed values only.

Preserved:

- strings
- numbers
- booleans
- `null`
- arrays of safe values
- nested plain objects with safe values

Omitted:

- functions
- symbols
- bigints
- class instances
- non-plain objects
- cyclic branches
- top-level `null` / `undefined` becomes `{}`

The helper does not read raw request bodies and does not mutate inputs.

## 6. Sensitive field behavior

Sensitive fields are omitted by default.

Default sensitive names include:

- `password`
- `confirmPassword`
- `currentPassword`
- `newPassword`
- `token`
- `secret`
- `apiKey`
- `authorization`
- `auth`
- `credential`
- `session`
- `cookie`

Dangerous keys are omitted:

- `__proto__`
- `constructor`
- `prototype`

## 7. Issue grouping behavior

`groupIssuesByField(...)` derives form `errors` from canonical issues.

Rules:

- `issue.field` becomes the errors key
- root/invalid issues map to `_form`
- multiple issues per field remain arrays
- issue order is preserved
- empty/missing issue input returns `{}`

## 8. Form state envelope behavior

`createFormState(input)` returns:

```js
{
  ok,
  kind: 'form',
  values,
  errors,
  issues,
  error,
  value,
  meta
}
```

Defaults are deterministic. Values are preserved safely. Issues are normalized and grouped. The helper is opt-in and default action behavior is unchanged.

`fail(createFormState(...), status)` now projects the form state body with the supplied status.

## 9. Example behavior

Added `examples/form-state-basic/`.

The example demonstrates:

- URL-encoded action input
- validation failure form state
- domain failure form state
- sensitive value omission
- explicit `303` redirect after success
- optional success form state JSON when explicitly chosen

## 10. Manifest decision

Manifest form metadata remains deferred.

Reason: `createFormState(...)` is opt-in inside handler code and cannot be inferred from action descriptors without executing user logic.

## 11. Deferred features

- automatic default action response conversion
- form generator
- frontend runtime
- client SDK
- OpenAPI
- session/flash helpers
- redirect-with-errors
- multipart/file upload handling
- manifest `form` metadata
- DB/auth
- CLI/compiler
- TypeScript conversion
- publish prep
- stable public API commitment

## 12. Tests added/updated

Added:

- `tests/kernel-form-state-values.test.js`
- `tests/kernel-form-state-errors.test.js`
- `tests/kernel-form-state-helper.test.js`
- `tests/form-state-basic-example.test.js`

Updated:

- `src/index.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `package.json`
- `README.md`
- `docs/internal/public-preview-api-classification.md`

## 13. Recommendation

Next best block: **Form Projection Design Gate** if form work continues before publish prep.

Keep it design-only: contract-to-field projection, labels/help metadata, input type inference, sensitive metadata, no renderer/frontend/client SDK/OpenAPI yet.
