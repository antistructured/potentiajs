# Route / Action Diagnostics Consistency Decision

## Files inspected

- `src/kernel/contract.js`
- `src/kernel/action.js`
- `src/kernel/error.js`
- `tests/kernel-contract-diagnostic-dx.test.js`
- `tests/kernel-action-validation-shape.test.js`
- `docs/internal/action-validation-failure-shape.md`
- `docs/internal/field-diagnostics-issue-shape-decision.md`
- `docs/internal/sigiljs-field-issue-extraction-decision.md`
- `docs/internal/generic-contract-issue-fallback-decision.md`

## Files changed

- `docs/internal/route-action-diagnostics-consistency-decision.md`

## Decision

Route contracts and action contracts should use the same canonical issue object shape everywhere.

Future contract failure responses should expose the same top-level response envelope for route and action contract failures:

```js
{
  ok: false,
  error: {
    code,
    message,
    boundary,
    issues
  },
  boundary,
  issues
}
```

Nested `error.issues` and `error.boundary` should remain for compatibility.

## Boundaries

Canonical route boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`
- `handler`

Canonical action boundaries:

- `input`
- `output`
- `handler`

Do not add redundant action-specific boundary names such as `actionInput` or `actionOutput`.

## Status mapping

Route request-side failures:

- `params` → `400`
- `query` → `400`
- `headers` → `400`
- `body` → `400`

Route response failures:

- `response` → `500`

Action failures:

- `input` → `400`
- `output` → `500`
- `handler` → `500`

These mappings match current behavior and should remain unchanged.

## Error code mapping

Route contract failures:

- request-side contracts → `POTENTIA_CONTRACT_FAILED`
- response contracts → `POTENTIA_RESPONSE_CONTRACT_FAILED`
- handler failures → `POTENTIA_HANDLER_FAILED`

Action failures:

- input contracts / parse boundary → `POTENTIA_ACTION_INPUT_FAILED`
- output contracts → `POTENTIA_ACTION_OUTPUT_FAILED`
- handler failures → `POTENTIA_ACTION_HANDLER_FAILED`

Canonical issue `code` values live inside each issue and are distinct from framework-level `error.code` values.

## Public detail level

Request/input failures may include field-level path details when safely available.

Response/output failures may also include path details where safe, but should remain conservative because they describe server output internals. If exposing a precise output path would reveal implementation details, fall back to root-level issue.

Handler failures should not expose field-level contract issues. They may expose only safe generic issue metadata:

```js
{
  code: 'handler_failed',
  message: 'Handler failed',
  path: [],
  field: null,
  boundary: 'handler',
  source: 'framework',
  expected: null,
  received: null,
  meta: null
}
```

## Route body vs action input

A route body contract attached to an action route still belongs to `body`.

An action input contract belongs to `input`.

This preserves a clear distinction:

- `body`: route/request boundary
- `input`: action-specific parsed/validated input boundary

## URL-encoded repeated fields

URL-encoded repeated fields parse to arrays before action input contracts run. Diagnostics should report whatever canonical path the contract failure safely provides.

Examples:

- whole field failure: `['tags']` → `tags`
- item failure: `['tags', 1]` → `tags[1]`
- unavailable detail: `[]` → `null`

Do not invent item indices unless the validator reports them.

## Compatibility transition

Current action responses already include top-level `ok`, `boundary`, and `issues` for action-shaped errors. Route errors currently expose only nested `error.issues`.

Future implementation should make route contract failures match action contract failure envelope while preserving nested fields.

## Deferred

- implementation
- migration tests for route top-level `ok`/`boundary`/`issues`
- richer response/output redaction policy
- field labels/localization
- form state preservation

## Blockers

- Consumers may already depend on current route error body shape; transition should be documented and tested as experimental before preview.
