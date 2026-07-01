# Form Projection Foundation Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Implemented the first renderer-independent form projection primitive:

- internal field projection utilities
- conservative input hints
- sensitive field flags
- SigilJS action input field projection
- nested object field flattening
- scalar array metadata
- opaque generic fallback
- experimental root export `projectForm(...)`
- metadata example coverage
- README/API classification updates

## 4. New/changed exports

New experimental root export:

- `projectForm`

Internal helpers are exported only from `src/kernel/form-projection.js` for tests/implementation use:

- `createFieldProjection`
- `deriveLabel`
- `deriveInputHint`
- `isSensitiveField`
- `projectFieldsFromContractProjection`

## 5. Field projection behavior

Field projections use this deterministic shape:

```js
{
  kind,
  name,
  path,
  field,
  label,
  help,
  placeholder,
  input,
  required,
  multiple,
  sensitive,
  options,
  defaultValue,
  contract,
  meta
}
```

Labels are derived from field names as display hints. `help`, `placeholder`, `options`, `defaultValue`, and `meta` default to `null`.

Input hints are conservative:

- string/unknown → `text`
- number/integer → `number`
- boolean → `checkbox`
- array → `text` with `multiple: true`
- email/url/website/phone/tel/password name hints where safe

## 6. SigilJS projection behavior

SigilJS object input contracts project fields when static metadata is available through existing `projectContract(...)` output.

Supported:

- simple object fields
- required/optional flags
- primitive kinds
- nested object flattening
- scalar array metadata as `multiple: true`
- deterministic order from contract projection order

Unsupported SigilJS shapes fall back honestly to opaque projection.

## 7. Opaque fallback behavior

Opaque cases:

- generic function contracts
- `{ parse }` contracts
- `{ check }` contracts
- missing action input contracts
- invalid action input to `projectForm(...)`
- SigilJS contracts without field metadata

Opaque shape includes:

```js
{
  opaque: true,
  fields: null,
  reason
}
```

Generic contracts are not executed and no fake fields are invented.

## 8. `projectForm(...)` behavior

`projectForm(action, options)` returns metadata-only form projection:

```js
{
  kind: 'form',
  id,
  actionId,
  method,
  encType,
  opaque,
  fields,
  reason,
  errors: { rootKey: '_form' },
  values: { preservation: 'safe-parsed-values' },
  validation: { server: 'authoritative', client: 'projection-only' },
  redirect: { afterPost: 'explicit-303-recommended' },
  meta
}
```

Defaults:

- `method: 'POST'`
- `encType: 'application/x-www-form-urlencoded'`

Supported minimal options:

- `id`
- `method`
- `encType`

The helper does not execute handlers, validators, transforms, generic contracts, or user code.

## 9. Example behavior

Updated `examples/form-state-basic/` to export:

- `createUserAction`
- `formProjection`

The example demonstrates metadata-only projection of an action input contract with field names, input hints, required/optional flags, and sensitive password metadata. It does not render HTML or generate client code.

## 10. Manifest decision

Manifest `forms` metadata remains deferred.

`projectForm(...)` is now available as an on-demand metadata helper. `createRouteManifest(...)` output was not changed.

## 11. Deferred features

- HTML rendering
- form generator
- frontend runtime
- client SDK
- OpenAPI
- manifest `forms` section
- multipart/file fields
- session/flash helpers
- redirect-with-errors
- arrays-of-objects/repeater model
- finite options/enum rendering policy beyond safe metadata
- explicit labels/help/placeholders metadata source
- DB/auth
- CLI/compiler
- TypeScript conversion
- publish prep
- stable API commitment

## 12. Tests added/updated

Added:

- `tests/kernel-form-field-projection.test.js`
- `tests/kernel-form-sigiljs-projection.test.js`
- `tests/kernel-form-opaque-projection.test.js`
- `tests/kernel-project-form.test.js`
- `tests/form-projection-example.test.js`

Updated:

- `src/index.js`
- `src/kernel/form-projection.js`
- `examples/form-state-basic/index.js`
- `examples/form-state-basic/README.md`
- `README.md`
- `docs/internal/public-preview-api-classification.md`

## 13. Recommendation

Next best block: **Public Preview Readiness Re-Gate**.

Re-audit public exports, package contents, examples, README truthfulness, API stability candidates, npm/JSR blockers, preview version readiness, and install-from-packed-artifact smoke before adding more form surface.
