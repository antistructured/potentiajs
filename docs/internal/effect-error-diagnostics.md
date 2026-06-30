# Effect Error Diagnostics

## Files inspected

- `src/kernel/effect.js`
- `src/kernel/error.js`
- `src/kernel/app.js`
- `tests/kernel-effect-command-validation.test.js`

## Files changed

- `tests/kernel-effect-error-diagnostics.test.js`
- `docs/internal/effect-error-diagnostics.md`

## Diagnostic behavior

Internal effect errors now have deterministic, useful messages for:

- unknown command type: `Unsupported effect command type: <type>`
- invalid command object: `Invalid effect command: type must be a string`
- invalid call command: `Invalid effect call command: fn must be a function`
- invalid call args: `Invalid effect call command: args must be an array when provided`
- invalid context command: `Invalid effect context command: key must be a non-empty string`

Command execution and generator failures preserve their thrown internal messages for direct `runEffect()` callers.

## Public safety behavior

Public app responses still hide unsafe effect internals:

- route effect failures return `POTENTIA_HANDLER_FAILED`
- hook effect failures return `POTENTIA_HANDLER_FAILED`
- message remains `Internal server error`
- status remains `500`

Exposed framework errors still behave as designed and can intentionally surface safe messages.

## Verification

```bash
bun test tests/kernel-effect-error-diagnostics.test.js tests/kernel-effect-command-validation.test.js
```

Result:

- 18 pass
- 0 fail

## Blockers

- No debug mode, tracing, or stack exposure was added.
- No effect-specific public error code family was added; existing safe framework normalization remains the boundary.
