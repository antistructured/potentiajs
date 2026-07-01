# Form State / Form Response Design Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed design decisions for:

- form state scope
- safe submitted value preservation
- sensitive field handling
- canonical issue-to-error-map grouping
- future opt-in form response envelope
- redirect-after-post behavior
- projection/manifest relationship
- future implementation plan

No implementation was added.

## 4. Safe value preservation policy

Future form-state helpers should preserve submitted values on validation failures and intentional domain failures when safe.

Preservation must use parsed input, not raw request bodies.

Preserve by default:

- strings
- numbers
- booleans
- `null`
- arrays of safe scalar values
- nested plain objects with safe scalar leaves

Do not preserve:

- raw bodies
- files/blobs/binary values
- functions/symbols
- unsafe object prototypes
- cyclic/unserializable objects
- handler/output failure values

URL-encoded repeated fields may preserve arrays of strings.

## 5. Sensitive field policy

Initial sensitivity should be name-based and conservative.

Denylist segments, case-insensitive:

```txt
password
confirmPassword
currentPassword
newPassword
token
secret
apiKey
authorization
auth
credential
session
cookie
```

Sensitive fields should be omitted from preserved values by default.

Future contract/form metadata may add explicit sensitivity controls.

## 6. Issue mapping policy

Future form state should preserve canonical `issues` and derive `errors` from them.

Mapping rules:

- use `issue.field` as the key when present
- use `_form` for root-level issues
- field values are arrays of issues
- preserve canonical issue order
- preserve original `issues` array

Example:

```js
{
  issues: [issue],
  errors: {
    email: [issue],
    _form: [issue]
  }
}
```

Nested and array fields use existing canonical field strings such as `profile.email` and `tags[0]`.

## 7. Form response envelope decision

Future form response state should be opt-in, not automatic default action behavior.

Recommended validation failure state:

```js
{
  ok: false,
  kind: 'form',
  values,
  errors,
  issues,
  error: {
    code: 'POTENTIA_ACTION_INPUT_FAILED',
    message: 'Action input contract failed.'
  },
  meta: null
}
```

Recommended domain failure state:

```js
{
  ok: false,
  kind: 'form',
  values,
  errors: { _form: [issue] },
  issues: [issue],
  error: {
    code: domainCode,
    message: domainMessage
  },
  meta: null
}
```

Recommended success state when not redirecting:

```js
{
  ok: true,
  kind: 'form',
  value,
  error: null,
  issues: [],
  errors: {},
  meta: null
}
```

Existing action behavior should remain compatible.

## 8. Redirect-after-post policy

Potentia should not auto-redirect after successful form POSTs.

Recommended successful form POST pattern:

```js
return redirect('/users', 303);
```

`303 See Other` should be recommended in docs for post-submit navigation.

Validation failures and domain failures should return response bodies by default rather than redirecting.

Session/flash redirect-with-errors flows remain deferred.

## 9. Projection/manifest relationship

Manifest form metadata is deferred until runtime form-state helpers exist.

Current action manifest metadata already includes useful foundations:

- accepted content types
- `enhancement.plainForm`
- `enhancement.fetch`
- `clientValidation: 'projection-only'`
- action result semantics

Future metadata may include:

```js
form: {
  capable: true,
  input: 'action.input',
  method: 'POST',
  contentTypes: ['application/x-www-form-urlencoded'],
  issueRootKey: '_form',
  valuePreservation: 'safe-parsed-values',
  redirectAfterPost: 'explicit-303-recommended'
}
```

Do not add this until implementation evidence exists.

## 10. Deferred features

- form state helper implementation
- form generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file uploads
- session/flash helpers
- custom domain issue protocol
- projected sensitive-field metadata
- DB/auth
- CLI/compiler
- TypeScript conversion
- publish prep
- stable public API commitment

## 11. Required future implementation passes

Recommended next implementation block:

1. scope lock
2. safe parsed-value preservation helper
3. sensitive field omission helper
4. issue-to-errors-map helper
5. opt-in form state helper
6. validation/domain failure integration tests
7. docs/package hygiene
8. final verification

The first implementation should remain helper-level and opt-in. It should not generate forms or add frontend/client surfaces.

## 12. Risks

- Name-based sensitive detection can miss project-specific secrets.
- Preserving nested JSON requires careful prototype/cycle handling.
- Field-specific domain failures need a future explicit issue protocol.
- Auto-changing action response shape would break compatibility; keep helpers opt-in.
- Redirect-with-errors requires a session/flash storage policy and should not be improvised.

## 13. Recommendation

Next best block: **Form State Helper Foundation**.

Keep it narrow: internal/opt-in helper behavior for safe values, sensitive omission, issue grouping, and form-state envelope. Do not add form generation, frontend runtime, client SDK, OpenAPI, multipart/files, sessions, package split, or publish prep.
