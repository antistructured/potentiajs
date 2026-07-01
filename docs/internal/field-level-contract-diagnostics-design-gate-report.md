# Field-Level Contract Diagnostics Design Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- diagnostics scope lock
- canonical issue shape decision
- path/field representation decision
- SigilJS extraction strategy
- generic contract fallback strategy
- route/action consistency strategy
- projection/manifest diagnostics strategy
- README honesty update

Not performed:

- source implementation
- new public exports
- runtime behavior changes
- form generator
- form state preservation
- session/flash helpers
- frontend runtime
- client SDK
- OpenAPI
- multipart/file upload support
- DB/auth
- CLI/compiler
- publish prep
- TypeScript conversion

## 4. Canonical issue shape

Future normalized issues should use this full key-stable shape:

```js
{
  code: code,
  message: message,
  path: pathArray,
  field: fieldStringOrNull,
  boundary: boundary,
  source: source,
  expected: expectedOrNull,
  received: receivedOrNull,
  meta: null
}
```

All keys are required. Unknown data uses `null`, not omitted keys.

Root-level fallback:

```js
{
  code: 'contract_failed',
  message: 'Contract rejected value',
  path: [],
  field: null,
  boundary: boundary,
  source: source,
  expected: null,
  received: null,
  meta: null
}
```

## 5. Path / field representation

Canonical path is an array of string/number segments:

- `[]`
- `['email']`
- `['profile', 'name']`
- `['tags', 0]`

Display field is derived from path:

- `[]` → `null`
- `['email']` → `'email'`
- `['profile', 'name']` → `'profile.name'`
- `['tags', 0]` → `'tags[0]'`

Do not let `field` drift from `path`.

## 6. Boundary model

Canonical boundaries:

Route boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`
- `handler`

Action boundaries:

- `input`
- `output`
- `handler`

Status mapping remains:

- request/input boundary failures: `400`
- response/output boundary failures: `500`
- handler failures: `500`

## 7. SigilJS issue extraction strategy

Installed SigilJS exposes structured error fields:

- `code: 'SIGIL_VALIDATION_FAILED'`
- `message`
- `path`
- `expected`
- `actual`

Future Potentia implementation should extract these only when the shape is recognized conservatively.

Normalize to:

- `source: 'sigil'`
- path from SigilJS `path`, or `[]` if invalid/unavailable
- expected from safe `expected`, or `null`
- received from safe type-summary `actual`, or `null`
- safe Potentia-generated message

Rejected: parsing arbitrary human error strings to infer paths/types.

Fallback for unknown SigilJS shapes is one root-level `source: 'sigil'` issue.

## 8. Generic fallback strategy

Generic contracts remain opaque.

Default generic issue:

```js
{
  code: 'contract_failed',
  message: 'Contract rejected value',
  path: [],
  field: null,
  boundary: boundary,
  source: 'generic',
  expected: null,
  received: null,
  meta: null
}
```

Thrown messages from generic contracts must not be exposed by default.

Optional custom issue protocols are deferred. Any future protocol must sanitize and normalize provided issue data before exposure.

## 9. Route / action consistency strategy

Route and action contract failures should converge on the same response envelope:

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

Nested `error.boundary` and `error.issues` remain for compatibility.

Route contract failures currently use nested-only shape; future implementation should align them with action failures while respecting experimental API status.

## 10. Projection / manifest strategy

Projection and manifest outputs should not precompute possible runtime issues.

Possible future minimal metadata:

```js
diagnostics: {
  issueShape: {
    code: 'string',
    message: 'string',
    path: 'array',
    field: 'string|null',
    boundary: 'string',
    source: 'sigil|generic|framework|unknown',
    expected: 'string|null',
    received: 'string|null',
    meta: 'null'
  },
  boundaries: ['input', 'output'],
  fieldIssues: 'runtime'
}
```

Recommendation: implement runtime normalization first; add manifest diagnostics metadata only if useful afterward.

## 11. Deferred features

- implementation
- field-level issue tests
- custom generic issue protocol
- localization
- field labels
- form state preservation
- session flash
- form generator
- frontend runtime
- client SDK/OpenAPI
- multipart/file validation
- stable public API commitment
- publish prep

## 12. Required future implementation passes

Recommended implementation block order:

1. Internal issue-shape utility and path-to-field helper.
2. Generic fallback normalization.
3. SigilJS validation error normalization with conservative guards.
4. Route contract failure response alignment.
5. Action input/output failure normalization.
6. URL-encoded repeated-field tests.
7. Nested object/array tests.
8. Optional projection/manifest diagnostics metadata decision after runtime behavior is proven.
9. README/docs update with implemented examples only.
10. Full verification/package hygiene.

## 13. Risks

- SigilJS `actual` must be verified as a safe type summary before public exposure.
- Existing route error shape consumers may need migration when top-level `ok`/`boundary`/`issues` are added.
- Generic contract issue protocols could become a data-exposure risk if trusted blindly.
- Over-eager manifest metadata could imply unimplemented form/client features.
- Precise output/response diagnostics may reveal server implementation details unless redacted conservatively.

## 14. Recommendation

Proceed next to **Field-Level Contract Diagnostics Implementation** if the design gate is accepted.

Keep the implementation narrow:

- internal issue normalization utility
- SigilJS issue normalization
- generic root fallback
- route/action response consistency
- deterministic tests
- no form generator/client/OpenAPI yet
