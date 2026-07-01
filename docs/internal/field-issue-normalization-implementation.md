# Field Issue Normalization Implementation

## Files changed

- `src/kernel/diagnostics.js`
- `tests/kernel-field-issue-normalization.test.js`
- `docs/internal/field-issue-normalization-implementation.md`

## Implemented helpers

Internal-only diagnostics helpers now normalize field issues without adding root public exports:

- `normalizeIssue(input, options)`
- `normalizeIssues(input, options)`
- `deriveField(path)`
- `safeReceived(value)`
- `createRootIssue(options)`
- `sigilIssueFromError(error, boundary)`

## Behavior

Canonical issues include:

- `code`
- `message`
- `path`
- `field`
- `boundary`
- `source`
- `expected`
- `received`
- `meta`

Paths are normalized arrays. `field` is derived from path using dot/bracket notation. Root issues use `path: []` and `field: null`.

`safeReceived(...)` exposes safe type descriptors only, never raw object/array/string values.

Issue arrays are sorted deterministically.

## Verification

Narrow tests added in `tests/kernel-field-issue-normalization.test.js` cover root shape, nested paths, array indices, invalid paths, safe received descriptors, raw object hiding, and deterministic ordering.
