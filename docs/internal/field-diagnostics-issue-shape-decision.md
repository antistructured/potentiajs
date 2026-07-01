# Field Diagnostics Issue Shape Decision

## Files inspected

- `src/kernel/contract.js`
- `src/kernel/error.js`
- `src/kernel/action.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `docs/internal/field-diagnostics-scope-lock.md`

## Files changed

- `docs/internal/field-diagnostics-issue-shape-decision.md`

## Decision

Future Potentia field-level diagnostics should normalize every contract issue into one canonical issue object:

```js
{
  code: code,
  message: message,
  path: pathArray,
  field: fieldStringOrNull,
  boundary: boundary,
  source: source,
  expected: expectedOrNull,
  received: receivedOrNull,
  meta: null
}
```

## Required fields

All canonical issue objects must include every key below, even when values are unknown:

- `code`
- `message`
- `path`
- `field`
- `boundary`
- `source`
- `expected`
- `received`
- `meta`

Stable key presence matters more than density. Consumers should never need to test whether a key exists.

## Field definitions

### `code`

Machine-readable short code.

Initial recommended codes:

- `invalid_type`
- `missing_required`
- `invalid_value`
- `invalid_item`
- `contract_failed`
- `parser_failed`
- `unsupported_content_type`
- `malformed_input`

Codes must be safe, deterministic, lower_snake_case, and not copied from arbitrary thrown error text.

### `message`

Safe display message. It must be suitable for user-facing form/tooling surfaces and must not include raw input, stack traces, arbitrary thrown messages, or internal validator details.

Recommended generic messages:

- `Invalid value`
- `Required value is missing`
- `Contract rejected value`
- `Input could not be parsed`

### `path`

Canonical machine path as an array of string/number segments.

Examples:

- `[]`
- `['email']`
- `['profile', 'name']`
- `['tags', 0]`

Root-level failures use `[]`.

### `field`

Form-friendly display field derived from `path`.

Examples:

- `[]` → `null`
- `['email']` → `'email'`
- `['profile', 'name']` → `'profile.name'`
- `['tags', 0]` → `'tags[0]'`

`field` should be derived, not independently authored, so it cannot drift from `path`.

### `boundary`

Boundary that failed. Canonical boundary names are:

- `params`
- `query`
- `headers`
- `body`
- `response`
- `input`
- `output`
- `handler`

### `source`

Safe source category. Initial source values:

- `sigil`
- `generic`
- `framework`
- `unknown`

Do not expose internal validator class names or arbitrary library internals.

### `expected` / `received`

Safe expected/received summaries where available.

- Use strings such as `'string'`, `'number'`, `'object'`, `'array'`, `'undefined'`.
- Use `null` when unknown.
- Do not include raw received values.

### `meta`

Reserved extension point. Initial value should be `null`.

Do not use `meta` for raw validator payloads during initial implementation.

## Root-level fallback issue

Opaque or unavailable field data should use:

```js
{
  code: 'contract_failed',
  message: 'Contract rejected value',
  path: [],
  field: null,
  boundary: 'input',
  source: 'generic',
  expected: null,
  received: null,
  meta: null
}
```

The `boundary` changes to the actual failing boundary.

## Sorting / determinism

Issue arrays must be deterministic.

Recommended sort order when multiple issues exist:

1. path depth
2. path lexicographic segment order, with numeric indices sorted numerically within the same parent
3. code
4. message

If a validator already emits deterministic order, Potentia may preserve it, but tests should lock the result.

## Stability status

This shape should be treated as an experimental public contract once implemented, because future forms/tooling will consume it.

Before stable release, it may evolve; after preview adoption begins, changes should be additive where possible.

## Deferred

- implementation
- issue code taxonomy finalization
- localization
- field label generation
- custom validator issue protocol
- form state preservation
- OpenAPI/client SDK mapping

## Blockers

- SigilJS error shapes need runtime coverage before implementation.
- Generic contracts cannot provide field metadata without an explicit future protocol.
