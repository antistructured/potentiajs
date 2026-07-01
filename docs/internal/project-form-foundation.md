# `projectForm(...)` Foundation

## Files changed

- `src/kernel/form-projection.js`
- `src/index.js`
- `tests/kernel-project-form.test.js`
- `docs/internal/project-form-foundation.md`

## Implemented behavior

Added experimental root export:

```js
projectForm(action, options)
```

`projectForm(...)` returns deterministic renderer-independent form metadata:

- `kind: 'form'`
- `id`
- `actionId`
- `method`
- `encType`
- `opaque`
- `fields`
- `reason`
- `errors`
- `values`
- `validation`
- `redirect`
- `meta`

Defaults:

- `method: 'POST'`
- `encType: 'application/x-www-form-urlencoded'`
- `errors.rootKey: '_form'`
- `values.preservation: 'safe-parsed-values'`
- `validation.server: 'authoritative'`
- `validation.client: 'projection-only'`
- `redirect.afterPost: 'explicit-303-recommended'`

## Safety

The helper projects action input contracts only as metadata. It does not execute handlers, validators, transforms, or generic contracts.

Manifest output remains unchanged.

## Options

Supported minimal options:

- `id`
- `method`
- `encType`

## Verification

`tests/kernel-project-form.test.js` covers metadata shape, id/actionId, default and overridden method/encoding, SigilJS field projection, opaque generic fallback, meta carry-through, handler/contract non-execution, determinism, and root export.
