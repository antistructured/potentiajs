# SigilJS Contract Projection Enrichment

## Files inspected

- installed `@weipertda/sigiljs@0.18.0`
- `src/kernel/contract-projection.js`
- `tests/kernel-sigiljs-contracts.test.js`
- `tests/kernel-contract-projection.test.js`
- `docs/internal/framework-sigiljs-native-contracts.md`
- `docs/internal/framework-contract-projection.md`

## Files changed

- `src/kernel/contract-projection.js`
- `tests/kernel-sigiljs-projection.test.js`
- `docs/internal/sigiljs-contract-projection-enrichment.md`

## Behavior added

SigilJS contract projection now uses safe static metadata from:

- `toJSONSchema()`
- `describe()`
- schema `properties`/`required` fallback

For object contracts, projection can now include:

- non-opaque `kind: 'sigil'`
- schema metadata
- field summaries
- required field names
- optional field names
- primitive field kinds
- nested object field summaries

Example field summary:

```js
{
  name: 'id',
  required: true,
  kind: 'string',
  fields: null
}
```

Nested object summaries use the same small shape under `fields`.

## Fallback behavior

Unsupported SigilJS shapes, such as scalar contracts, remain honest:

- schema may be available
- `fields` is `null`
- `required` is `null`
- `optional` is `null`

No fake field metadata is invented.

## Safety behavior

Projection does not execute validation against fake values and does not call generic user contract logic.

## Verification

```bash
bun test tests/kernel-sigiljs-projection.test.js tests/kernel-contract-projection-upgrade.test.js tests/kernel-contract-projection.test.js
```

Result:

- 19 pass
- 0 fail

## Blockers

- SigilJS projection remains limited to metadata exposed by SigilJS itself.
- Verbose field-level validation issue projection remains deferred.
