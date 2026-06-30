# Effect Command Validation

## Files inspected

- `src/kernel/effect.js`
- `tests/kernel-effect.test.js`
- `tests/kernel-effect-helpers.test.js`
- `docs/internal/effect-command-helpers.md`

## Files changed

- `src/kernel/effect.js`
- `tests/kernel-effect-command-validation.test.js`
- `docs/internal/effect-command-validation.md`

## Implementation

Added deterministic validation for object-shaped yielded commands.

Validated cases:

- missing/non-string command `type`
- unknown command type
- `call` with non-function `fn`
- `call` with provided non-array `args`
- `context` with missing/non-string/empty key

Compatibility preserved:

- non-object yielded values still pass through
- valid raw commands without `meta` still work
- raw `call` without `args` still defaults to `[]`
- helper commands still work

## Public error behavior

Invalid effect commands thrown inside route handlers or hooks still normalize through the existing safe handler failure path:

```json
{ "error": { "code": "POTENTIA_HANDLER_FAILED", "message": "Internal server error" } }
```

## Verification

```bash
bun test tests/kernel-effect-command-validation.test.js tests/kernel-effect-helpers.test.js tests/kernel-effect.test.js
```

Result:

- 27 pass
- 0 fail

## Deferred

- no schema system
- no debugger
- no tracing
- no dev/prod branching
- no `delay()` validation because `delay()` remains deferred
