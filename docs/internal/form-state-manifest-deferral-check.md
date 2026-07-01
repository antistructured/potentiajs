# Form State Manifest Deferral Check

## Files inspected

- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-action-result-projection.test.js`
- `docs/internal/form-state-projection-manifest-decision.md`
- `docs/internal/action-result-manifest-semantics.md`

## Files changed

- `docs/internal/form-state-manifest-deferral-check.md`

## Decision

Manifest form metadata remains deferred.

No `form` object was added to `projectAction(...)` or `createRouteManifest(...)` in this block.

## Rationale

`createFormState(...)` is now implemented, but it is a small opt-in helper rather than action-level behavior. Manifest output currently describes actions, route linkage, content types, enhancement posture, and result semantics. Adding manifest `form` metadata now would imply route/action-level form behavior that is not automatic.

Current manifest metadata already remains useful:

- `contentTypes: ['application/json', 'application/x-www-form-urlencoded']`
- `enhancement.plainForm: true`
- `enhancement.fetch: true`
- `enhancement.clientValidation: 'projection-only'`
- result semantics for success, validation failure, redirect, and domain failure

## Future candidate

A later form projection block may add metadata after field projection/sensitivity metadata is designed:

```js
form: {
  state: 'opt-in',
  issueRootKey: '_form',
  valuePreservation: 'safe-parsed-values',
  redirectAfterPost: 'explicit-303-recommended'
}
```

## Tests added/updated

None. No manifest metadata was added.

## Blockers

- Sensitive field metadata is still name-based in the helper and not statically projectable from actions.
- Form helper usage is opt-in per handler and cannot be inferred from an action descriptor without executing user code.
