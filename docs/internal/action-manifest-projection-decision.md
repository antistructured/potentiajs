# Action Manifest / Projection Decision

## Files inspected

- `docs/internal/route-metadata-manifest-foundation-report.md`
- `docs/internal/route-manifest-projection.md`
- `docs/internal/action-boundary-model-decision.md`
- `docs/internal/action-input-parsing-decision.md`
- `docs/internal/action-validation-error-shape-decision.md`
- `src/kernel/route-manifest.js`
- `src/kernel/route-projection.js`
- `src/kernel/contract-projection.js`

## Decision summary

Future action metadata should appear in route manifests as a top-level `actions` section linked to route delivery by `routeId`.

Recommended future manifest shape:

```js
{
  kind: 'potentia-route-manifest',
  version: 2,
  routes: [...],
  actions: [
    {
      kind: 'action',
      id: 'users.create',
      routeId: 'POST /users',
      method: 'POST',
      path: '/users',
      input: projectedInputContract,
      output: projectedOutputContract,
      contentTypes: [
        'application/json',
        'application/x-www-form-urlencoded'
      ],
      enhancement: {
        plainForm: true,
        fetch: true,
        clientValidation: 'projection-only'
      },
      source: sourceOrNull,
      meta: metaOrNull
    }
  ],
  lookups: {...},
  diagnostics: []
}
```

## Where actions live

Use both concepts, linked by IDs:

- route entries describe HTTP delivery
- action entries describe application intent and data boundary
- action entries link to route entries through `routeId`

Do not force every route to be an action.

Rationale:

- `GET /health` is a route, not necessarily an action
- one action may eventually have multiple delivery routes
- route IDs and action IDs answer different questions
- manifests remain useful for non-action routes

## Contract projection reuse

Action manifest entries should reuse `projectContract(...)` for:

- `input`
- `output`

Projection must obey the same law:

- do not execute contracts
- generic contracts remain opaque
- SigilJS metadata is included only when safely available

## Metadata fields

Action entries should include:

- `id`
- `routeId`
- `method`
- `path`
- `input`
- `output`
- `contentTypes`
- `enhancement`
- `source`
- `meta`

Optional future additions:

- `name`
- `redirects`
- `successStatus`
- `failureStatus`
- `requiresAuth`
- `csrf`
- `idempotency`

These are deferred until real use cases exist.

## Lookups

Future manifest lookup additions may include:

```js
lookups: {
  byId: {},
  byName: {},
  byMethodPath: {},
  actionsById: {},
  actionsByRouteId: {}
}
```

Lookup values should remain compact IDs or indexes, not duplicated action objects.

## Diagnostics

Future diagnostics should include:

```txt
POTENTIA_MANIFEST_DUPLICATE_ACTION_ID
POTENTIA_MANIFEST_ACTION_ROUTE_MISSING
POTENTIA_MANIFEST_ACTION_INPUT_INVALID
POTENTIA_MANIFEST_ACTION_OUTPUT_INVALID
```

Diagnostics should be deterministic and should not throw during manifest creation unless a future stable API explicitly chooses strict mode.

## Form/client generator boundary

Action manifest metadata may power future forms, clients, and docs, but this design gate does not implement those generators.

The manifest should describe enough for future tooling to know:

- what input contract exists
- what output contract exists
- which HTTP route delivers the action
- which content types are accepted
- whether plain forms/fetch/client validation are supported

## Deferred

- manifest `actions` implementation
- manifest version migration
- form/client/docs generators
- action lookup APIs
- file output/loading
- action source inference
- OpenAPI mapping
- route/action many-to-many delivery semantics

## Blockers

- Action descriptors must exist before manifests can project actions.
- The first action implementation must decide how route handlers expose action metadata without executing handlers.
- Manifest versioning should be handled carefully once `actions` is implemented.
