# Form State Issue Grouping Implementation

## Files changed

- `src/kernel/form-state.js`
- `tests/kernel-form-state-errors.test.js`
- `docs/internal/form-state-issue-grouping-implementation.md`

## Implemented behavior

`groupIssuesByField(issues, options)` groups canonical issues into a form-friendly `errors` map.

Rules:

- groups by `issue.field` when present
- root or invalid issues use `_form`
- multiple issues per field remain arrays
- issue order is preserved
- input issue arrays are not mutated
- empty/missing issues return `{}`

## Options

```js
{ rootKey: '_form' }
```

`rootKey` can be overridden internally if needed, but `_form` is the default form-level key.

## Verification

`tests/kernel-form-state-errors.test.js` covers field grouping, multiple issues, root mapping, invalid issue mapping, order preservation, non-mutation, and empty input behavior.
