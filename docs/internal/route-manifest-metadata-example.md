# Route Manifest Metadata Example

## Files inspected

- `examples/composed-basic/index.js`
- `examples/composed-basic/README.md`
- `tests/composed-basic-example.test.js`

## Files changed

- `examples/composed-basic/index.js`
- `examples/composed-basic/README.md`
- `tests/kernel-route-manifest-example.test.js`
- `docs/internal/route-manifest-metadata-example.md`

## Example behavior

The composed basic example now includes route metadata for user routes:

- `users.index`
- `users.show`
- `users.create`

Each named user route includes:

- `meta.description`
- descriptive `source.file`

The manifest example test demonstrates that `createRouteManifest(app)` can support future docs/tests/tooling by listing named routes, descriptions, safe SigilJS contract summaries, and name/ID lookups.

## Safety behavior

No generator was added. The example only inspects descriptors and projection metadata.

## Verification

```bash
bun test tests/kernel-route-manifest-example.test.js tests/composed-basic-example.test.js tests/kernel-projection-metadata-example.test.js
```

Result:

- 15 pass
- 0 fail

## Deferred

- docs generator
- client generator
- OpenAPI generator
- forms/actions generator
- manifest file output
