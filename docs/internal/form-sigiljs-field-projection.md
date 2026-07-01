# Form SigilJS Field Projection

## Files changed

- `src/kernel/form-projection.js`
- `tests/kernel-form-sigiljs-projection.test.js`
- `docs/internal/form-sigiljs-field-projection.md`

## Implemented behavior

`projectFieldsFromContractProjection(...)` projects safe SigilJS object metadata into renderer-independent form fields.

Supported behavior:

- simple object fields
- required/optional metadata
- primitive field kinds
- nested object leaf flattening
- scalar array metadata as `multiple: true`
- deterministic field order from existing contract projection order
- honest opaque fallback when fields are unavailable

## Safety

Projection uses existing `projectContract(...)` output. It does not execute action handlers, contracts, validators, or transforms, and it does not require sample input.

## Options/enums

Options remain `null` unless safe finite metadata is available in a later block. No select/radio rendering decision was added.

## Verification

`tests/kernel-form-sigiljs-projection.test.js` covers simple fields, required/optional fields, nested flattening, scalar arrays, deterministic output, and fallback for unsupported SigilJS shapes.
