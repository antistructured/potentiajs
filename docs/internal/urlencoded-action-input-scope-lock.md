# URL-Encoded Action Input Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/contract.js`
- `src/kernel/error.js`
- `tests/kernel-action-input.test.js`
- `tests/kernel-action-contracts.test.js`
- `tests/kernel-action-errors.test.js`
- `examples/action-basic/index.js`
- `examples/action-basic/README.md`
- `docs/internal/action-primitive-foundation-report.md`
- `docs/internal/action-input-parsing-decision.md`
- `docs/internal/forms-progressive-enhancement-decision.md`

## Findings

Current action input parsing lives in `src/kernel/action.js` inside `parseActionInput(request)`. It reads the request text, accepts empty bodies as `null`, supports JSON content types, and treats missing content type with valid JSON as JSON.

Action routes are detected in `src/kernel/app.js`, then executed with `runAction(...)`; non-action routes skip this path.

Action input contracts already run against the parsed action input and attach the result to `ctx.input`.

## Decisions

URL-encoded parsing should live with the action input boundary in `src/kernel/action.js` because it is action-specific and must feed the same contract/error path as JSON.

Supported content types after this block:

- `application/json`
- `application/json; charset=utf-8`
- `application/x-www-form-urlencoded`
- `application/x-www-form-urlencoded; charset=utf-8`

Detection is case-insensitive and ignores parameters.

Missing content type behavior remains intentionally narrow:

- empty body → `ctx.input = null`
- non-empty missing content type → attempt JSON only
- URL-encoded-looking missing content type is rejected by the JSON parse path

Unsupported non-empty content types fail deterministically with `POTENTIA_ACTION_INPUT_FAILED`.

URL-encoded parser policy:

- scalar fields become strings
- repeated fields become arrays of strings
- empty values remain empty strings
- `+` decodes to space
- percent encoding decodes with `decodeURIComponent`
- malformed percent encoding fails safely with action input failure
- no numeric/boolean/date/null coercion
- dangerous keys are rejected: `__proto__`, `constructor`, `prototype`

## Deferred

- multipart/form-data
- file uploads
- nested bracket syntax
- array bracket syntax special handling
- generated forms
- browser helpers
- client SDK
- OpenAPI
- action auto-routing/RPC
- DB/auth
- CLI/compiler
- publish prep

## Blockers

- Field-level issue paths remain limited by existing safe contract diagnostics.
- Generated forms still need action result/redirect semantics before they can be ergonomic.
- Multipart must wait for file ownership, storage, limits, and streaming decisions.
