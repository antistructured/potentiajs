# Form Projection Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/action.js`
- `src/kernel/action-projection.js`
- `src/kernel/contract-projection.js`
- `src/kernel/form-state.js`
- `src/kernel/route-manifest.js`
- `tests/kernel-form-state-*.test.js`
- `tests/kernel-action-projection.test.js`
- `examples/form-state-basic/`
- `docs/internal/form-projection-design-gate-report.md`
- `docs/internal/form-projection-contract-field-decision.md`
- `docs/internal/form-projection-field-metadata-shape-decision.md`
- `docs/internal/form-projection-input-sensitive-decision.md`
- `docs/internal/form-projection-nested-array-options-decision.md`
- `docs/internal/form-projection-action-manifest-decision.md`

## Files changed

- `docs/internal/form-projection-foundation-scope-lock.md`

## Findings

Potentia already has action input contracts, `projectContract(...)`, `projectAction(...)`, `createFormState(...)`, and route manifest action metadata. Form projection itself does not exist.

`projectContract(...)` exposes enough static metadata for a first form projection foundation:

- generic contracts are opaque
- SigilJS object contracts expose fields where safe
- nested SigilJS object summaries are available through existing field metadata
- scalar arrays currently expose `kind: 'array'` without item detail

## Decisions

Implement a single experimental root export:

```js
projectForm(action, options)
```

Implementation should live in:

- `src/kernel/form-projection.js`

Low-level field helpers should stay internal to that module except where tests import them directly from the internal path. They should not be root exports.

`projectForm(...)` should use existing `projectContract(...)` and action descriptors. It must not execute handlers, hooks, contracts, validators, transforms, or user code.

Manifest `forms` metadata remains deferred. This block may project form metadata on demand, but it must not mutate `createRouteManifest(...)` output.

## Deferred

- HTML rendering
- form generator
- renderer APIs
- frontend runtime
- client SDK
- OpenAPI
- manifest `forms` section
- multipart/file fields
- session/flash helpers
- redirect-with-errors
- DB/auth
- CLI/compiler
- TypeScript source
- publish prep

## Blockers

- Generic contracts cannot provide fields without executing user logic.
- SigilJS array metadata currently does not expose item types in the simple `Array` case, so scalar-array support must remain conservative.
- Options/enums should only project if finite values are safely visible; current implementation may keep `options: null` until metadata is verified.
