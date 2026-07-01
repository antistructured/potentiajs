# Action Result Manifest Semantics

## Files inspected

- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-action-projection.test.js`
- `tests/kernel-route-manifest.test.js`

## Files changed

- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-action-result-projection.test.js`
- `tests/kernel-action-projection.test.js`
- `docs/internal/action-result-manifest-semantics.md`

## Projection metadata

`projectAction(...)` now includes deterministic result semantics metadata:

```js
result: {
  success: 'response-projection',
  validationFailure: 'action-input-failed',
  redirect: 'explicit',
  domainFailure: 'fail-result'
}
```

Invalid action projection uses `result: null`.

Projection still does not execute handlers or contracts.

## Manifest metadata

Manifest action entries include the same `result` semantics object.

Manifest action entries also preserve existing content/enhancement metadata:

- `contentTypes: ['application/json', 'application/x-www-form-urlencoded']`
- `enhancement.plainForm: true`
- `enhancement.fetch: true`
- `enhancement.clientValidation: 'projection-only'`

## Verification

```bash
bun test tests/kernel-action-result-projection.test.js tests/kernel-action-projection.test.js tests/kernel-route-manifest.test.js
```

Result:

- 24 pass
- 0 fail

## Deferred

- client generation
- form generation
- OpenAPI mapping
- manifest file writer
- action lookup additions
