# Form Projection Contract-To-Field Decision

## Files inspected

- `src/kernel/contract-projection.js`
- `src/kernel/action-projection.js`
- `docs/internal/form-projection-scope-lock.md`
- `docs/internal/contract-projection-upgrade-report.md`

## Files changed

- `docs/internal/form-projection-contract-field-decision.md`

## Decision summary

Future form projection should start from action input contracts for normal app usage.

Primary source:

```txt
action.input → projectContract(action.input) → form fields
```

Direct contract-to-form projection can be supported later as a lower-level helper, but action input projection should be the main path because it preserves action id, method, route/manifest relationship, and form submission semantics.

## Generic contract behavior

Opaque generic contracts must not invent fields.

For generic function/parse/check contracts, future form projection should return an honest opaque form projection such as:

```js
{
  kind: 'form',
  opaque: true,
  fields: null,
  diagnostics: [{ code: 'POTENTIA_FORM_OPAQUE_CONTRACT', message: 'Action input contract cannot be projected into fields' }]
}
```

`fields: null` is preferred over `[]` for opaque contracts because `[]` can imply a known empty form. If an implementation also exposes `opaque: true`, renderers/tooling can distinguish unsupported from intentionally empty.

## SigilJS object fields

SigilJS object contracts may project form fields when static metadata exists.

Supported metadata sources:

- `describe()` property metadata
- `toJSONSchema()` object `properties`
- existing `projectContract()` `fields`, `required`, and `optional`

The projection must not execute validation.

## Required and optional fields

Requiredness should use the existing contract projection policy:

1. `describe().properties[].required` when available
2. JSON Schema `required` when available
3. existing projected `field.required` fallback
4. `null` / unknown when unavailable

Optional fields remain fields. They should project `required: false`, not be omitted.

## Default values

Default values are deferred unless contract metadata exposes a safe static default. Do not infer defaults from runtime transforms, parser behavior, examples, or previous submissions.

Initial future field projections should use:

```js
defaultValue: null
```

unless a later metadata convention explicitly supplies a safe default.

## Field order

Field order policy:

1. Preserve contract metadata order when provided by `describe()`.
2. Preserve JSON Schema property insertion order when falling back to schema metadata.
3. If order is unavailable or derived from unordered maps, use deterministic lexicographic order.

Do not sort if the upstream metadata already preserves author order.

## Enrichment requirement

The current `projectContract()` metadata is enough for a first limited implementation, but richer field projections will eventually need explicit metadata for labels, help, placeholders, options, sensitive overrides, and renderer hints.

That enrichment should be additive and remain metadata-only.

## Deferred

- implementation
- direct public `projectContractToForm(...)` helper
- default value inference
- field labels/help/options metadata source
- execution-based inference
- OpenAPI/JSON Schema generator expansion
- renderer/client integration

## Blockers

- Generic contracts cannot be safely projected into fields.
- SigilJS option/enum/default metadata availability must be verified before implementation.
