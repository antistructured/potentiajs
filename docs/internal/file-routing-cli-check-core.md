# File Routing CLI Check Core

## Files inspected

- `src/cli.js`
- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/scanner.js`
- `docs/internal/file-routing-cli-check-stale-detection-decision.md`

## Files changed

- `src/cli.js`
- `src/dev/file-routing/writer.js`
- `docs/internal/file-routing-cli-check-core.md`

## Behavior

Added non-mutating check support via internal helpers.

`src/dev/file-routing/writer.js` now exposes internal source generation:

```js
generateFileRouteSource(options)
```

This shares the same scanner/generator path as `generateFileRoutes(...)`, but returns expected source without writing output.

`src/cli.js` now exposes internal testable helper:

```js
checkFileRoutes(options)
```

Status values:

```txt
current
missing
stale
failed
```

## Non-mutating check flow

`checkFileRoutes(...)`:

1. generates expected route source in memory
2. returns `failed` if scanner/generator diagnostics fail
3. reads the existing output file
4. returns `missing` if output file does not exist
5. normalizes CRLF/LF differences
6. returns `current` if normalized source matches
7. returns `stale` if normalized source differs

## Newline normalization

Comparison uses normalized newline comparison:

```txt
CRLF -> LF
```

No parser/AST dependency was added.

## Non-mutation guarantees

Check core does not:

- call `writeFile`
- call `rename`
- call `rm`
- create `.potentia/`
- replace stale output
- delete output
- execute route modules

`generateFileRoutes(...)` still writes using the same temp-file/rename behavior as before.

## Export boundaries

`generateFileRouteSource(...)` is internal to `src/dev/file-routing/writer.js` and is not exported by `src/file-routing.js`.

The public subpath remains unchanged:

```js
export { generateFileRoutes } from './dev/file-routing/writer.js';
```

Root exports remain unchanged.

## Blockers

None.

## Publish status

No publish command was run.
