# Action Content-Type Detection

## Files inspected

- `src/kernel/action.js`
- `tests/kernel-action-input.test.js`

## Files changed

- `src/kernel/action.js`
- `tests/kernel-action-content-type.test.js`
- `docs/internal/action-content-type-detection.md`

## Behavior

Action input content type detection now normalizes to:

- `json`
- `form-urlencoded`
- `missing`
- `unsupported`

Detected content types:

- `application/json`
- `application/json; charset=utf-8`
- `application/x-www-form-urlencoded`
- `application/x-www-form-urlencoded; charset=utf-8`

Detection is case-insensitive and tolerates parameters.

Missing content type remains compatible with the existing JSON path: a valid JSON body is accepted. Missing content type with URL-encoded-looking content is not treated as form data.

Unsupported non-empty content types fail deterministically with `POTENTIA_ACTION_INPUT_FAILED`.

## Verification

```bash
bun test tests/kernel-action-content-type.test.js tests/kernel-action-urlencoded-parser.test.js tests/kernel-action-input.test.js
```

Result:

- 24 pass
- 0 fail

## Deferred

- multipart/form-data
- text/plain
- custom parser registry
