# Form Projection Field Metadata Shape Decision

## Files inspected

- `src/kernel/contract-projection.js`
- `src/kernel/form-state.js`
- `docs/internal/form-projection-contract-field-decision.md`

## Files changed

- `docs/internal/form-projection-field-metadata-shape-decision.md`

## Decision summary

Future form field projection should use a renderer-independent, explicit object shape.

Canonical field shape:

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

## Required keys

Every projected field should include these keys, even when values are `null`:

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

A full deterministic shape is preferred over sparse objects because renderers/tooling can make simpler decisions without checking missing properties.

## Key policy

- `kind`: always `'field'`
- `name`: submission name; initially same as `field`
- `path`: canonical path array
- `field`: canonical dot/bracket field string
- `label`: display hint
- `help`: nullable helper text
- `placeholder`: nullable placeholder text
- `input`: renderer-neutral input hints
- `required`: boolean when known, `false` when explicitly optional, `null` only if unknown
- `multiple`: boolean
- `sensitive`: boolean
- `options`: finite option metadata or `null`
- `defaultValue`: safe static default or `null`
- `contract`: compact contract metadata
- `meta`: explicit extension metadata or `null`

## Label policy

Labels may be safely derived from the field name as a display hint.

Examples:

- `email` → `Email`
- `profile.name` → `Profile Name`
- `firstName` → `First Name`
- `apiKey` → `Api Key`

Explicit future metadata should override derived labels.

Derived labels are not validation semantics and should not imply localization.

## Help and placeholder policy

`help` and `placeholder` default to `null`.

They should only be populated from explicit metadata in the future. Do not infer help text from validation messages, examples, diagnostics, or field names.

## Input hint policy

Renderer hints live under `input`.

Initial shape:

```js
input: {
  type,
  mode: null,
  autocomplete: null
}
```

The `input` object is a suggestion for renderers, not an HTML commitment.

## Public shape status

The field metadata shape should be experimental if implemented later. It should not be treated as stable until real renderer/generator usage proves it.

## Deferred

- implementation
- layout/group metadata
- localization
- explicit labels/help/placeholders metadata source
- renderer-specific props
- HTML attribute completeness
- stable public shape commitment

## Blockers

- Contract metadata currently does not provide labels/help/placeholders.
- Option/default metadata support needs verification before implementation.
