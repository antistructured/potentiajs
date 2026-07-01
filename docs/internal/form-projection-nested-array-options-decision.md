# Form Projection Nested / Array / Options Decision

## Files inspected

- `src/kernel/contract-projection.js`
- `src/kernel/form-state.js`
- `docs/internal/form-projection-field-metadata-shape-decision.md`
- `docs/internal/form-projection-input-sensitive-decision.md`

## Files changed

- `docs/internal/form-projection-nested-array-options-decision.md`

## Decision summary

Initial form projection should flatten nested object fields into renderer-independent field entries using canonical `path` and `field` metadata.

No renderer layout or HTML generation is added.

## Nested objects

Nested object fields should project as flattened leaf fields.

Example:

```js
{
  path: ['profile', 'name'],
  field: 'profile.name',
  name: 'profile.name'
}
```

Future optional grouping metadata may describe object boundaries, but initial implementation should not require renderers to understand nested groups.

## Group metadata

Group metadata is deferred.

Potential future shape:

```js
groups: [
  { path: ['profile'], field: 'profile', label: 'Profile', fields: ['profile.name'] }
]
```

Do not include this until renderer needs are proven.

## Arrays and repeated fields

Arrays of scalar values project as a field with:

```js
multiple: true
```

Repeated URL-encoded fields align with scalar arrays and should use the same field name.

Do not invent item indices for scalar repeated fields. Item-level fields such as `tags[0]` should only appear when contract metadata explicitly describes indexed validation.

## Arrays of objects

Arrays of objects are deferred for the first implementation.

If encountered, a future projection may mark the field unsupported/complex rather than generating nested repeaters:

```js
{
  multiple: true,
  contract: { kind: 'array', item: 'object' },
  meta: { unsupported: 'array-of-objects' }
}
```

Do not design a repeater renderer in this block.

## Options and enums

Options should project only when finite allowed values are safely exposed by contract metadata.

Candidate option shape:

```js
options: [
  { value: 'admin', label: 'Admin', disabled: false, meta: null }
]
```

Option labels may be derived from primitive values as display hints unless explicit labels are provided later.

## Select/radio/checkbox policy

Projection should not choose renderer widgets such as select vs radio.

It may expose:

- finite `options`
- scalar vs multiple
- boolean input hint

A renderer can choose select/radio/checkbox UI later.

## Unsupported complex structures

Unsupported structures should be represented honestly, not expanded by guessing.

Examples:

- recursive objects
- maps/records without known keys
- discriminated unions without stable metadata
- arrays of objects
- binary/file-like values

## Deferred

- implementation
- group/layout metadata
- array-of-object repeaters
- renderer widget selection
- option metadata source
- file/multipart fields
- union/discriminator projection

## Blockers

- Current contract projection may not expose finite options/enums.
- Complex nested collections require renderer and state-management decisions outside this block.
