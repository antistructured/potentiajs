# File Routing CLI Diagnostics / Output / Exit Code Decision

## Files inspected

- `scripts/generate-file-routes.js`
- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/diagnostics.js`
- `docs/internal/file-routing-public-diagnostics-decision.md`
- `docs/internal/file-routing-cli-options-defaults-decision.md`

## Exit code decision

Initial exit codes:

```txt
0 = generation successful
1 = generation failed due to route diagnostics, scanner failure, generator failure, or write/IO failure
2 = invalid CLI usage/options
```

Rationale:

- normal file-route diagnostics are not usage errors; they are generation failures
- invalid flags or missing flag values are user command syntax errors
- exit codes stay small and conventional

## Success output

Human-readable success output goes to stdout.

Recommended format:

```txt
Generated file routes:
- root: routes
- output: .potentia/routes.generated.js
- routes: 3
- scopes: 1
```

Rules:

- concise by default
- no full generated source printed by default
- paths should be displayed as user-supplied or cwd-relative when possible
- do not imply runtime route registration

## Error output

Errors go to stderr.

Recommended format:

```txt
File route generation failed:
- POTENTIA_FILE_ROUTE_COLLISION routes/users/[id].js Route collision with routes/users/[userId].js
```

Diagnostic display fields, in order when available:

```txt
code path/message-location message
```

Location preference:

1. `filePath`
2. `relativePath`
3. `routePath`
4. `rootDir`
5. `outputFile`
6. omit location if unavailable

## Usage error output

Invalid command/flags should go to stderr and exit `2`.

Example:

```txt
Usage error: --root requires a value
```

Unknown command example:

```txt
Usage error: expected `potentia routes generate`
```

## Stack traces

Hide stack traces by default.

Reason:

- route diagnostics should be actionable and stable
- raw stack traces leak internals and local paths
- unexpected implementation failures can still produce a safe single-line message

A future `--verbose` flag may opt into stack traces, but it is deferred.

## JSON mode decision

JSON mode is deferred.

Future possible command:

```bash
potentia routes generate --json
```

Future JSON output should match the public `generateFileRoutes(...)` result shape rather than inventing a separate CLI schema.

## `--check` output decision

`--check` is deferred. When added later, it should have separate output text, likely:

```txt
Generated file routes are current.
```

or:

```txt
Generated file routes are stale:
- output: .potentia/routes.generated.js
```

## Diagnostics policy

Diagnostics should include:

- code
- file/path/location when available
- message

Diagnostics should not include:

- raw stack trace by default
- raw thrown error objects
- generated source dump
- hidden route execution results

## Blockers

None.

## Implementation status

No implementation was added.

No package metadata was changed.

## Publish status

No publish command was run.
