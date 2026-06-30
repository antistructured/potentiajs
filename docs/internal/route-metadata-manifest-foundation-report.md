# Route Metadata / Manifest Foundation Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`

## 2. Current version

- `0.0.1`

## 3. Scope completed

Completed:

- manifest scope lock
- route metadata shape
- deterministic route ID strategy
- optional route name projection
- experimental route manifest creation
- manifest diagnostics
- manifest lookup tables
- composed example route metadata
- manifest metadata example tests
- README/internal docs updates
- package hygiene checks

Not performed:

- OpenAPI generation
- JSON Schema expansion
- client SDK generation
- forms/actions generation
- frontend work
- file-routing scanner changes
- CLI/compiler integration
- manifest file writing/loading
- publish prep
- TypeScript conversion

## 4. New/changed exports

Added experimental root export:

- `createRouteManifest`

Existing experimental projection exports were retained:

- `projectContract`
- `projectRoute`
- `projectRoutes`

No exports were removed. No manifest API is stable.

## 5. Route metadata behavior

`route()` options now support optional descriptive metadata:

- `name`
- `meta`
- `source`

Route descriptors expose normalized metadata fields, and `projectRoute()` includes them. Metadata does not affect route matching or request execution.

## 6. Route ID/name strategy

Default route IDs use:

```txt
METHOD /normalized/path
```

Names are optional and descriptive. Uniqueness is handled by manifest diagnostics, not by `route()`.

## 7. Manifest behavior

`createRouteManifest(input, options)` supports:

- route arrays
- route collections
- mounts
- app objects

The manifest shape includes:

- `kind: 'potentia-route-manifest'`
- `version: 1`
- package info
- route list
- lookups
- diagnostics
- manifest meta

Manifest route entries include IDs, names, method/path, contract projections, hook summaries, source, meta, and index.

## 8. Manifest diagnostics/lookups

Diagnostics:

- `POTENTIA_MANIFEST_DUPLICATE_ROUTE_ID`
- `POTENTIA_MANIFEST_DUPLICATE_ROUTE_NAME`
- `POTENTIA_MANIFEST_INVALID_ROUTE`

Lookups:

- `byId[routeId] -> route index`
- `byName[name] -> route ID`
- `byMethodPath['METHOD /path'] -> route ID`

Duplicate lookup entries keep the first route and report deterministic diagnostics.

## 9. Example/test metadata behavior

The composed basic example now includes named routes with descriptions/source metadata for:

- `users.index`
- `users.show`
- `users.create`

`tests/kernel-route-manifest-example.test.js` demonstrates named route lists, descriptions, safe SigilJS contract summaries, and lookup-by-name behavior.

## 10. Deferred features

- OpenAPI generation
- JSON Schema generator expansion
- TypeScript generation
- client SDK generation
- forms/actions generation
- route manifest file writing/loading
- manifest-to-file-routing bridge
- route source inference
- CLI/compiler integration
- runtime router lookup replacement
- publish prep

## 11. Tests added/updated

Added:

- `tests/kernel-route-metadata.test.js`
- `tests/kernel-route-id-strategy.test.js`
- `tests/kernel-route-manifest.test.js`
- `tests/kernel-route-manifest-diagnostics.test.js`
- `tests/kernel-route-manifest-example.test.js`

Updated:

- `tests/kernel-route-projection.test.js`
- `examples/composed-basic/index.js`
- `examples/composed-basic/README.md`

## 12. Recommendation

Next best block: **Contract-Native Forms / Actions Design Gate**, if publish decisions remain deferred and full-stack design should continue.

The route manifest now gives Potentia a trustworthy app description without executing user logic.
