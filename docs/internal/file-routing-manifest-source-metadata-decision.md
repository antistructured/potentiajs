# File Routing Manifest / Source Metadata Decision

## Files inspected

- `README.md`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/generator.js`
- `tests/file-routing-scanner.test.js`
- `tests/kernel-route-manifest.test.js`
- prior route manifest notes and file-routing reports

## Current manifest foundation

Potentia already has `createRouteManifest(...)` as an experimental root export.

Current manifest posture:

- route IDs default to deterministic `METHOD /path`
- route metadata can include `name`, `meta`, and `source`
- manifest creation does not execute handlers/hooks/contracts
- manifest diagnostics report duplicate IDs/names

File routing should feed this existing manifest model rather than create a separate parallel manifest system.

## Source metadata policy

Future generated file-routing output should attach source metadata to generated route descriptors where safe.

Recommended generated metadata shape:

```js
source: {
  kind: 'file-route',
  file: 'routes/users/[id].js'
}
```

Requirements:

- `source.file` uses a route-root-relative or project-relative path
- no absolute paths by default
- no machine-local paths by default
- no source metadata that requires runtime filesystem access
- metadata is generated, not required to be hand-authored in route files

## Route ID policy

Route IDs should remain method/path-based through `createRouteManifest(...)`.

Do not invent file-route IDs yet.

Reason:

- method/path IDs align with runtime route behavior
- route files can move without necessarily changing the public route identity
- duplicate route behavior should be diagnosed by route semantics, not file names alone

## Route name policy

Do not auto-infer route names from file paths in the first public file-routing API.

Reason:

- inferred names create naming stability promises
- name collisions need a separate policy
- names may imply URL helper generation that does not exist yet

Future route names can be designed separately, likely through explicit route options or `_routes.js` metadata conventions.

## Manifest relationship

Generated routes should work naturally with:

```js
createRouteManifest(appOrRoutes, {
  packageName: '@potentiajs/core',
  packageVersion: '0.1.0-preview.0'
});
```

No separate `createFileRouteManifest(...)` should be added initially.

The generated route module should export explicit route composition; then existing projection/manifest APIs can inspect the resulting app/routes.

## `_routes.js` metadata relationship

Folder metadata may contribute:

- hooks
- contracts
- meta

Folder metadata should not be required to hand-author `source` for child routes.

The generator owns file source metadata because it knows the route tree. Hand-authored route-level source metadata can still be preserved if already present, but generated file-route metadata should not erase explicit author metadata without a defined merge policy.

Recommended future merge policy:

- preserve explicit route `source` if present
- add generated source only when absent, or under a nested key such as `source.generated`
- document merge behavior before implementation

## Path policy

Use relative source paths:

```txt
routes/users/[id].js
```

Avoid absolute paths:

```txt
/home/user/project/routes/users/[id].js
```

Absolute paths can leak local paths and make package docs/tests non-portable.

## Deferred

- automatic route names from files
- file-route-specific route IDs
- separate file-route manifest file
- manifest file writing/loading
- URL helper generation
- source maps
- editor jump-to-source protocol
- explicit source merge implementation

## Decision

- generated routes should include relative `source.file` metadata in a future implementation
- route IDs remain method/path-based
- route names are not inferred yet
- existing `createRouteManifest(...)` remains the manifest API
- no separate file-route manifest API yet
- no absolute paths by default

## Blockers

No design blocker remains.

## Publish status

No publish command was run.
