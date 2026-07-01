# Form Field Projection Utility

## Files changed

- `src/kernel/form-projection.js`
- `tests/kernel-form-field-projection.test.js`
- `docs/internal/form-field-projection-utility.md`

## Implemented behavior

Added internal renderer-independent field projection utilities in `src/kernel/form-projection.js`.

Implemented helpers:

- `createFieldProjection(...)`
- `deriveLabel(...)`
- `deriveInputHint(...)`
- `isSensitiveField(...)`

Field projections use the decided stable shape:

- `kind`
- `name`
- `path`
- `field`
- `label`
- `help`
- `placeholder`
- `input`
- `required`
- `multiple`
- `sensitive`
- `options`
- `defaultValue`
- `contract`
- `meta`

## Input hints

Implemented conservative mappings:

- string/unknown → `text`
- number/integer → `number`
- boolean → `checkbox`
- array → `text` with `multiple: true`

Safe name hints:

- `email` → `email`
- `url` / `website` → `url`
- `phone` / `tel` → `tel`
- password variants → `password`

## Sensitive fields

Sensitive detection aligns with `createFormState(...)` name policy and marks fields such as password/token/secret/apiKey/auth/session/cookie as `sensitive: true`.

## Verification

`tests/kernel-form-field-projection.test.js` covers conservative input hints, sensitive flags, nested path/label derivation, scalar array metadata, null defaults, and deterministic shape.
