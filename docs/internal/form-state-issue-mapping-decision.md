# Form State Issue Mapping Decision

## Files inspected

- `src/kernel/diagnostics.js`
- `src/kernel/response.js`
- `tests/kernel-action-validation-shape.test.js`
- `docs/internal/field-level-contract-diagnostics-implementation-report.md`
- `docs/internal/form-state-safe-value-preservation-decision.md`

## Files changed

- `docs/internal/form-state-issue-mapping-decision.md`

## Decision summary

Future form state should preserve the canonical `issues` array and derive a form-friendly `errors` map from it.

Recommended shape:

```js
{
  issues: [issue],
  errors: {
    email: [issue],
    _form: [issue]
  }
}
```

## Grouping key

Use `issue.field` as the grouping key when it is a non-empty string.

Examples:

- `email`
- `profile.email`
- `tags[0]`
- `items[2].name`

## Root-level issues

Use `_form` for issues whose `field` is `null` or missing.

Root-level issues include:

- generic contract fallback issues
- malformed parser failures
- unsupported content-type failures
- domain failures not tied to a specific field
- future form-level business rules

## Nested fields

Nested fields use the canonical field string derived from `path`:

- `['profile', 'email']` → `profile.email`
- `['address', 'postalCode']` → `address.postalCode`

Do not invent nested paths. Use only canonical issue metadata.

## Array and repeated-field behavior

Array paths use bracket notation:

- `['tags', 0]` → `tags[0]`
- `['items', 2, 'name']` → `items[2].name`

URL-encoded repeated fields that fail as a whole may map to `tags` if the validator reports `['tags']`. If the validator reports an item index, map to `tags[0]`, `tags[1]`, etc.

Do not invent item indices for repeated URL-encoded values.

## Multiple issues per field

Field entries are arrays. Preserve all issues for a field.

Ordering policy:

1. Preserve the order of the canonical `issues` array.
2. Append each issue to its mapped field/root group in that same order.
3. Do not sort inside `errors` unless the canonical issue normalizer already sorted the source issues.

## Original issues array

Always preserve the original `issues` array in form state.

Reasons:

- canonical issues are machine-readable
- `errors` is derived convenience data
- clients/tooling may need boundary/source/expected/received metadata
- preserving `issues` prevents lossy grouping

## Derived-only policy

`errors` must be derived from canonical issues, not independently generated.

If an issue object is invalid, normalize it first in the future implementation and then map it.

## Deferred

- implementation helper
- localization or labels
- custom field aliases
- contract-driven error display priority
- client-side error rendering helpers

## Blockers

- Domain failures currently have no field metadata. Field-specific domain failures would require a future explicit issue protocol or helper.
