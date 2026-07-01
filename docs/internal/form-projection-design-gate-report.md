# Form Projection Design Gate Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed design decisions for renderer-independent form projection:

- form projection scope
- contract-to-field projection policy
- field metadata shape
- input type inference policy
- sensitive field policy
- nested/array/options policy
- action/manifest relationship
- future implementation plan

No source implementation was added.

## 4. Contract-to-field projection policy

Future form projection should primarily start from action input contracts:

```txt
action.input → projectContract(action.input) → form fields
```

Direct raw contract projection may be added later as a lower-level helper.

SigilJS object contracts may project fields when static metadata exists through `describe()`, `toJSONSchema()`, or existing `projectContract()` fields.

Generic function/parse/check contracts remain opaque. They should not invent fields. Use `fields: null` plus `opaque: true` to distinguish unsupported projection from an intentionally empty form.

Projection must never execute validation, handlers, hooks, transforms, or arbitrary user code.

Field order should preserve contract metadata order where available, then schema property order, then deterministic sorted order if necessary.

Default values remain deferred unless safe static metadata exists.

## 5. Field metadata shape

Future canonical field projection:

```js
{
  kind: 'field',
  name: 'email',
  path: ['email'],
  field: 'email',
  label: 'Email',
  help: null,
  placeholder: null,
  input: {
    type: 'email',
    mode: null,
    autocomplete: 'email'
  },
  required: true,
  multiple: false,
  sensitive: false,
  options: null,
  defaultValue: null,
  contract: {
    kind: 'sigil',
    expected: 'string'
  },
  meta: null
}
```

The shape is renderer-independent and deterministic. Keep all keys present with `null` where unknown.

Labels may be derived from field names as display hints. Explicit future metadata can override derived labels.

`help` and `placeholder` default to `null` and should only come from explicit future metadata.

No layout metadata yet.

## 6. Input type inference policy

Input type inference is conservative and produces hints only.

Recommended primitive mapping:

- string → `text`
- number/integer → `number`
- boolean → `checkbox`
- scalar array → repeated field / `multiple: true`
- object → nested flattened fields
- unknown → `text`

Name-based hints are allowed for common safe cases:

- `email` → `email`
- `url` / `website` → `url`
- `phone` / `tel` → `tel`
- password variants → `password`

Validation remains server authoritative.

## 7. Sensitive field policy

Sensitive detection should align with `createFormState(...)` omission policy.

Sensitive names:

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

Sensitive fields project `sensitive: true` and must not preserve submitted values.

Password-like fields may suggest `input.type: 'password'`. Token/secret/auth/session fields should not force renderer behavior; renderers may later choose password, hidden, omitted, or custom handling.

Explicit sensitivity metadata override remains deferred.

## 8. Nested/array/options policy

Nested object fields should initially flatten into leaf fields using canonical path/field metadata:

```js
{
  path: ['profile', 'name'],
  field: 'profile.name',
  name: 'profile.name'
}
```

Group/layout metadata is deferred.

Arrays of scalar values project as one field with `multiple: true`. Repeated URL-encoded fields align with scalar arrays.

Arrays of objects are deferred or represented honestly as unsupported complex fields.

Options/enums should project only when finite allowed values are safely exposed by contract metadata. Projection should expose options but not choose select/radio/checkbox rendering.

## 9. Action/manifest relationship

Future candidate helper:

```js
projectForm(action, options)
```

It should project one action input contract into one renderer-independent form metadata object.

Candidate future form projection:

```js
{
  kind: 'form',
  id: 'users.create',
  actionId: 'users.create',
  method: 'POST',
  encType: 'application/x-www-form-urlencoded',
  fields: [],
  errors: { rootKey: '_form' },
  values: { preservation: 'safe-parsed-values' },
  validation: {
    server: 'authoritative',
    client: 'projection-only'
  },
  redirect: {
    afterPost: 'explicit-303-recommended'
  },
  meta: null
}
```

Manifest integration remains deferred until `projectForm(...)` exists.

Preferred future manifest strategy: explicitly generated top-level `forms` section rather than automatic embedded action form metadata.

`createFormState(...)` is runtime form state shaping. Form projection is static metadata shaping. Projection may document compatibility with `createFormState(...)`, but must not infer handler usage.

## 10. Deferred features

- source implementation
- `projectForm(...)`
- new public exports
- contract-to-field implementation
- manifest `forms` metadata
- renderer/HTML generator
- frontend runtime
- client SDK
- OpenAPI
- multipart/file upload projection
- session/flash helpers
- layout/group metadata
- option/enum implementation
- explicit labels/help/placeholders metadata source
- sensitive override metadata
- multiple forms per action
- DB/auth
- CLI/compiler
- TypeScript conversion
- publish prep
- stable public API commitment

## 11. Required future implementation passes

Recommended implementation block: **Form Projection Foundation**.

Suggested passes:

1. scope lock
2. internal field shape helper
3. action input contract projection
4. SigilJS object field projection
5. opaque generic fallback
6. input type + sensitive flag inference
7. nested/scalar-array support
8. docs/tests/package verification

Keep it metadata-only: no renderer, generator, frontend runtime, client SDK, OpenAPI, multipart/files, sessions, package split, or publish prep.

## 12. Risks

- SigilJS metadata may not expose enough option/default details for rich fields.
- Name-based input/sensitive hints can be wrong.
- Flattening nested fields may not satisfy future layout/rendering needs.
- Opaque generic contracts limit form projection usefulness for custom validators.
- Adding manifest form metadata too early may create compatibility obligations before field shape is proven.

## 13. Recommendation

Next best block: **Form Projection Foundation** if form work continues.

Implement only metadata projection: `projectForm(...)`, action input contract to field metadata, safe SigilJS field projection, opaque generic fallback, conservative input hints, and sensitive flags. Do not add rendering, form generation, frontend/client SDK, OpenAPI, multipart/files, sessions, package split, or publish prep.
