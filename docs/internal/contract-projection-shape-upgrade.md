# Contract Projection Shape Upgrade

## Files inspected

- `src/kernel/contract-projection.js`
- `src/kernel/contract.js`
- `tests/kernel-contract-projection.test.js`
- `docs/internal/contract-projection-upgrade-scope-lock.md`

## Files changed

- `src/kernel/contract-projection.js`
- `tests/kernel-contract-projection.test.js`
- `tests/kernel-contract-projection-upgrade.test.js`
- `docs/internal/contract-projection-shape-upgrade.md`

## Implementation

`projectContract()` now returns richer deterministic metadata:

```js
{
  kind,
  capabilities,
  capability,
  opaque,
  schema,
  fields,
  required,
  optional,
  meta
}
```

Generic contracts remain opaque:

- function contracts: `kind: 'function'`
- parse contracts: `kind: 'parse'`
- check contracts: `kind: 'check'`
- missing contracts: `kind: 'none'`
- invalid/unknown contracts: `kind: 'unknown'`

Compatibility retained where useful:

- `capabilities` remains present
- `schema` remains present

## Safety behavior

Projection does not execute generic function, parse, or check logic. Unknown contracts project deterministically as opaque.

## Verification

```bash
bun test tests/kernel-contract-projection-upgrade.test.js tests/kernel-contract-projection.test.js
```

Result:

- 13 pass
- 0 fail

## Blockers

- Generic contracts remain shape-opaque unless explicit static metadata is introduced later.
- Field-level generic projection remains deferred.
