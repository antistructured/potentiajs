# Form State Action Integration Example

## Files changed

- `examples/form-state-basic/index.js`
- `examples/form-state-basic/README.md`
- `examples/form-state-basic/package.json`
- `tests/form-state-basic-example.test.js`
- `package.json`
- `docs/internal/form-state-action-integration-example.md`

## Example behavior

The new example demonstrates opt-in `createFormState(...)` usage with action submissions.

It covers:

- URL-encoded action input
- manual validation failure state
- domain failure state via `fail(createFormState(...), status)`
- sensitive value omission
- explicit success redirect with `303`
- optional success form state returned as JSON when explicitly chosen

## Scope exclusions

The example does not add:

- form generation
- frontend runtime
- client SDK
- OpenAPI
- session/flash helpers
- multipart/file handling

## Package decision

`examples/form-state-basic/` was intentionally added to `package.json` `files` alongside the other public examples.

## Verification

`tests/form-state-basic-example.test.js` verifies validation failure shape, domain failure shape, sensitive omission, explicit redirect, unchanged default action behavior, and explicit success form state.
