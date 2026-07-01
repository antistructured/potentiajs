# Form Opaque Contract Projection

## Files changed

- `src/kernel/form-projection.js`
- `tests/kernel-form-opaque-projection.test.js`
- `docs/internal/form-opaque-contract-projection.md`

## Implemented behavior

Unsupported contracts now project honestly as opaque form projections.

Opaque cases:

- generic function contracts
- `{ parse }` contracts
- `{ check }` contracts
- missing action input contracts
- invalid action input to `projectForm(...)`
- SigilJS contracts whose fields are unavailable

Opaque shape:

```js
{
  opaque: true,
  fields: null,
  reason
}
```

No fake fields are invented.

## Safety

Generic contracts are never executed during projection. Invalid actions and missing input contracts return deterministic metadata instead of throwing for ordinary projection use.

## Verification

`tests/kernel-form-opaque-projection.test.js` covers function/parse/check opacity, missing input behavior, invalid action behavior, non-execution, and stable shape.
