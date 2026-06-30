# Kernel Contract Diagnostic DX

## Files inspected

- `src/kernel/contract.js`
- `src/kernel/contract-projection.js`
- `src/kernel/error.js`
- `tests/kernel-contract-diagnostics.test.js`
- `tests/kernel-sigiljs-contracts.test.js`
- `tests/kernel-contract-projection.test.js`
- `docs/internal/framework-contract-diagnostics.md`
- `docs/internal/framework-contract-projection.md`

## Files changed

- `src/kernel/contract.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- existing contract diagnostic expectations
- `docs/internal/kernel-contract-diagnostic-dx.md`

## Diagnostic changes

Contract issue summaries are now safer and more informative:

- SigilJS validation failures: `SigilJS contract rejected value`
- Generic `{ check(value) }` returning false: `Contract check returned false`
- Generic function/parse exceptions: `Contract parser rejected value`

Preserved behavior:

- `boundary` remains present for request/response contract failures.
- `issues` remains a deterministic array of issue objects.
- Raw request bodies are not exposed.
- Thrown validator messages are not exposed.
- Response contract failures remain conservative.
- Field-level verbose SigilJS projection remains deferred.

## Tests added

Added `tests/kernel-contract-diagnostic-dx.test.js` for:

- params diagnostics
- query diagnostics
- headers diagnostics
- body diagnostics
- response diagnostic safety
- generic thrown contract safety
- SigilJS deterministic summaries
- stable issue arrays

## Verification

```bash
bun test tests/kernel-contract-diagnostic-dx.test.js tests/kernel-contract-diagnostics.test.js tests/kernel-sigiljs-contracts.test.js tests/kernel-contract-boundary.test.js tests/kernel-query-header-contracts.test.js tests/kernel-params-contracts.test.js tests/kernel-contract-adapter.test.js
```

Result:

- 56 pass
- 0 fail

## Deferred

- full field-level SigilJS issue projection
- OpenAPI/JSON Schema generation expansion
- debug verbosity flags
- custom diagnostic formatter plugins
