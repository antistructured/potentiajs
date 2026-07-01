# Action Shape / Public Export

## Files inspected

- `src/index.js`
- `src/kernel/action.js`
- `src/kernel/route.js`
- `src/kernel/error.js`

## Files changed

- `src/kernel/action.js`
- `src/kernel/error.js`
- `src/index.js`
- `tests/kernel-action-shape.test.js`
- `docs/internal/action-shape-public-export.md`

## Behavior added

Added experimental root export:

- `action`

Implemented deterministic action descriptor shape:

```js
{
  kind: 'action',
  id,
  handler,
  input,
  output,
  meta,
  source
}
```

`action(id, handler, options)` now:

- requires a non-empty string `id`
- accepts plain functions and `effect(...)` descriptors
- stores `input` / `output` contracts without executing them
- stores `meta`
- normalizes descriptive `source`
- does not execute the handler during construction
- can be passed directly to `route(...)` as a handler descriptor

## Verification

```bash
bun test tests/kernel-action-shape.test.js
```

Result:

- 8 pass
- 0 fail

## Deferred

- action auto-routing
- hidden RPC transport
- forms
- clients
- OpenAPI
- stable API commitment
