# File Routing Public Diagnostics Decision

## Files inspected

- `src/dev/file-routing/diagnostics.js`
- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/writer.js`
- `tests/file-routing-diagnostics.test.js`
- `tests/file-routing-scanner.test.js`
- prior file-routing reports

## Current internal diagnostic codes

Current internal codes:

```txt
POTENTIA_FILE_ROUTE_COLLISION
POTENTIA_FILE_ROUTE_UNSUPPORTED_CATCH_ALL
POTENTIA_FILE_ROUTE_UNSUPPORTED_OPTIONAL_PARAM
POTENTIA_FILE_ROUTE_UNSUPPORTED_GROUP
POTENTIA_FILE_ROUTE_INVALID_PARAM
POTENTIA_FILE_ROUTE_MISSING_ROOT
```

Current internal writer/generator can also report:

```txt
POTENTIA_FILE_ROUTE_INVALID_SCAN
POTENTIA_FILE_ROUTE_INVALID_OPTIONS
POTENTIA_FILE_ROUTE_WRITE_FAILED
```

## Public diagnostic posture

Diagnostics can be public in preview, but must be marked experimental.

Reasons:

- diagnostics are important for developer tooling
- users need stable-enough codes to fix route trees
- preview status allows shape refinement before stable release
- fail-closed generation depends on understandable errors

## Diagnostic shape

Initial public diagnostic shape should be plain JSON-compatible objects.

Common fields:

- `code`: stable-ish diagnostic code string
- `message`: human-readable message
- `filePath`: relative or configured-path file reference when applicable
- `relativePath`: route-root-relative path when applicable
- `routePath`: projected route path when applicable
- `files`: list of colliding files when applicable
- `rootDir`: missing root when applicable
- `outputFile`: failed output when applicable
- `cause`: safe string cause for write failures only

Do not expose raw thrown errors or stack traces by default.

## Error vs warning policy

Initial implementation should support two categories conceptually:

- errors: prevent generated output
- warnings: allow generated output

Current diagnostics are all errors except ignored entries, which are neither errors nor warnings.

Future warnings may include:

- ignored unsupported extension
- ignored private file/folder
- route module shape that is valid but discouraged
- generated output overwrite notice

But ignored files should stay in a separate `ignored` list, not become noisy warnings by default.

## Fail-closed behavior

Required behavior:

- collisions are errors
- unsupported route syntax is an error
- invalid dynamic params are errors
- missing root is an error
- invalid options are errors
- write failure is an error
- no generated output should be written if errors exist before write
- previous valid generated output should be preserved when regeneration fails before write
- no partial output should remain after write failure cleanup

## Unsupported convention behavior

Unsupported conventions that look like future route syntax should fail closed:

- `[...slug]` catch-all
- `[[id]]` optional param
- `(group)` route group
- malformed `[id` / `id]` dynamic syntax
- invalid param names

Reason: silently treating future syntax as literal paths would make later support breaking.

Unsupported file extensions can remain ignored rather than errors because they do not claim route syntax under the current `.js`-only policy.

## Collision behavior

Collisions are errors.

Collision diagnostics should include:

- `code: POTENTIA_FILE_ROUTE_COLLISION`
- projected `routePath`
- all source files that map to that path
- method when method-aware route validation exists later

Current collision detection is path-level only because route modules are not imported/executed during scanning. Method-aware collisions are deferred until route module shape validation is designed.

## Write policy

- warnings only: output may be written
- ignored entries only: output may be written
- errors: output must not be written
- write failure: report error and clean temp file

## Public API result shape

Future public `generateFileRoutes(...)` should return an object rather than throw for normal validation failures:

```js
{
  ok: false,
  written: false,
  rootDir,
  outputFile,
  routes,
  scopes,
  ignored,
  warnings,
  errors
}
```

Throwing should be reserved for truly unexpected implementation failures, if any. Prefer safe result objects where possible.

## Deferred

- method-aware collisions
- route-module export validation diagnostics
- source-code location spans
- JSON schema for diagnostics
- stable diagnostic API guarantee
- warning categories beyond ignored entries

## Decision

- public diagnostics are preview/experimental
- errors fail closed
- warnings may allow output
- ignored private files are reported separately
- unsupported future syntax is an error
- no partial output on failure
- no raw stack traces by default

## Blockers

No design blocker remains.

## Publish status

No publish command was run.
