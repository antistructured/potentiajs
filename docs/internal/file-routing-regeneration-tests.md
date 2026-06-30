# File Routing Regeneration Tests

## Files inspected

- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/generator.js`
- `docs/internal/file-routing-writer-implementation.md`

## Files changed

- `tests/fixtures/file-routing-regeneration/`
- `tests/file-routing-regeneration.test.js`
- `docs/internal/file-routing-regeneration-tests.md`

## Behavior tested

Regeneration tests prove:

- running the writer twice produces identical output
- existing generated file is overwritten on successful regeneration
- failed regeneration preserves prior valid output
- failed regeneration does not write partial output
- route discovery order is normalized into deterministic generated import order
- output directory creation is deterministic
- temporary files are cleaned

## Failure policy

Chosen policy:

- successful regeneration atomically replaces the generated output through temporary-file write + rename
- scan/generation failures return before writing
- existing valid generated output is preserved on failure
- temporary files are removed on write failure where possible
- partial output is never intentionally left behind

## Verification

```bash
bun test tests/file-routing-regeneration.test.js
```

Result:

- 5 pass
- 0 fail

## Cleanup check

Each test removes fixture-local `.potentia/` output in `finally` blocks.

## Blockers

- Regeneration is single-run only; watch mode remains deferred.
- Method-aware collision diagnostics remain deferred.
