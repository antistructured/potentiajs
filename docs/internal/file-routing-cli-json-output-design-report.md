# File Routing CLI JSON Output Design Report

## 1. Current CLI state

Current package:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- binary: `potentia`
- root exports: unchanged, no CLI internals
- file-routing subpath: `@potentiajs/core/file-routing`
- file-routing public API: `generateFileRoutes`

Implemented commands:

```bash
potentia routes generate
potentia routes check
```

Implemented flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Current output mode is human-readable text only.

Current deferred JSON flag:

```txt
--json
```

## 2. JSON scope

JSON output is for automation and tools.

Core rule:

```txt
Text output is for humans.
JSON output is for tools.
```

JSON must change output format only. It must not change:

- generation behavior
- check behavior
- diagnostics semantics
- file-writing behavior
- check non-mutation behavior
- exit codes
- command semantics

## 3. Shared envelope

Use one shared envelope for resolved route commands.

Required fields:

```txt
ok
command
status
root
output
package
routes
scopes
diagnostics
```

Optional field:

```txt
hint
```

Resolved command envelope example:

```json
{
  "ok": true,
  "command": "routes generate",
  "status": "generated",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

For invalid usage where the command cannot be safely resolved, use a smaller envelope with `command: null` and `diagnostics` present.

## 4. Generate JSON behavior

Future command:

```bash
potentia routes generate --json
```

Success:

```json
{
  "ok": true,
  "command": "routes generate",
  "status": "generated",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

Failure:

```json
{
  "ok": false,
  "command": "routes generate",
  "status": "failed",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 0,
  "scopes": 0,
  "diagnostics": []
}
```

`routes generate --json` still writes output on success. JSON does not make generate non-mutating.

## 5. Check JSON behavior

Future command:

```bash
potentia routes check --json
```

Current:

```json
{
  "ok": true,
  "command": "routes check",
  "status": "current",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

Missing:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "missing",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": [],
  "hint": "Run potentia routes generate"
}
```

Stale:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "stale",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": [],
  "hint": "Run potentia routes generate"
}
```

Failed:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "failed",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 0,
  "scopes": 0,
  "diagnostics": []
}
```

`routes check --json` remains non-mutating.

## 6. Diagnostic shape

Use safe minimal diagnostic objects:

```json
{
  "code": "POTENTIA_FILE_ROUTE_COLLISION",
  "path": "routes/users/[id].js",
  "message": "Route collision"
}
```

Required fields:

```txt
code
message
```

Optional field:

```txt
path
```

Do not expose stack traces, raw thrown errors, raw internal objects, generated source, or absolute paths by default when a relative/user-facing path is available.

## 7. Invalid usage shape

If `--json` appears anywhere in args, try to emit JSON invalid usage.

Shape:

```json
{
  "ok": false,
  "command": null,
  "status": "invalid-usage",
  "diagnostics": [
    {
      "code": "POTENTIA_CLI_INVALID_USAGE",
      "message": "Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>] [--json]"
    }
  ]
}
```

Use `command: null` when command cannot be safely resolved.

## 8. stdout / stderr policy

Decision:

```txt
All valid JSON envelopes go to stdout, including failure envelopes.
Invalid usage with --json also goes to stdout when possible.
Non-JSON fatal process errors may go to stderr.
```

Rationale:

- tools can reliably parse stdout
- exit codes still communicate success/failure
- stderr remains available for unexpected process-level failures

Text mode remains unchanged.

## 9. Exit codes

JSON mode preserves existing exit-code semantics:

```txt
0 = generated/current success
1 = failed/missing/stale/generation or IO error
2 = invalid usage/options
```

## 10. Deferred features

Still deferred:

- JSON implementation
- pretty JSON
- diff output
- route table dumps
- route manifest output
- `generate --check`
- watch mode
- config files
- compiler/dev server
- route convention expansion
- release/publish fixes

## 11. Implementation plan

Recommended next implementation block:

1. Extend parser to accept `--json` for `routes generate` and `routes check` only.
2. Preserve rejection of `generate --check`, watch/config flags, and unknown commands.
3. Add a shared envelope builder for command results.
4. Add safe diagnostic normalization to `{ code, path?, message }`.
5. Print JSON envelopes to stdout for success and command failures.
6. Emit JSON invalid usage to stdout when `--json` appears anywhere and invalid usage is detected.
7. Preserve text-mode behavior exactly.
8. Add tests for generate success/failure JSON, check current/missing/stale/failed JSON, invalid usage JSON, stdout/stderr policy, and exit codes.
9. Add packed artifact smoke for `--json`.
10. Update README/example docs only after implementation passes.

## 12. Recommendation

Recommendation:

```txt
A — Implement CLI JSON Output
```

Reason:

The CLI now has stable text behavior for generate/check, and the JSON envelope/status/diagnostics policy is clear enough to implement without changing command semantics.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
