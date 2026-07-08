# File Routing CLI Check Mode Design Report

## 1. Current CLI state

Current package:

- package: `@potentiajs/core`
- version: `0.1.0-preview.0`
- binary: `potentia`
- root exports: unchanged, no CLI internals
- file-routing subpath: `@potentiajs/core/file-routing`
- file-routing public API: `generateFileRoutes`

Implemented command:

```bash
potentia routes generate
```

Implemented flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Current defaults:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

Current deferred features:

- `--json`
- `--check`
- `--watch`
- `--config`
- `--manifest`
- `--clean`
- `--verbose`
- `--silent`
- config files
- watch mode
- compiler/dev server

## 2. Scope

This design gate covers the next CLI polish layer: a CI-safe check mode that verifies generated route output is current without rewriting project files.

Design law:

```txt
generate writes. check verifies.
```

Future check mode must not mutate files.

Allowed future flow:

```txt
read routes/
generate expected source in memory
read existing output
compare
exit
```

Disallowed:

- rewriting output during check
- cleaning generated output
- watch mode
- config loading
- dev server
- compiler/build platform
- request-time filesystem scanning

## 3. Command decision

Canonical future command:

```bash
potentia routes check
```

Reasons:

- clear semantic split from `routes generate`
- natural CI command
- avoids surprising non-write behavior under a command named `generate`
- leaves future room for aliases after canonical behavior stabilizes

## 4. Alias decision

`potentia routes generate --check` should be a future alias at most.

First implementation should not include it.

Alias posture:

```txt
future alias, not first implementation
```

## 5. Flags / defaults

`routes check` should support the same flags and defaults as `routes generate`.

Flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Defaults:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

Equivalent explicit command:

```bash
potentia routes check --root routes --out .potentia/routes.generated.js --package @potentiajs/core
```

## 6. Stale detection algorithm

Future algorithm:

1. Resolve options using the same semantics as `routes generate`.
2. Run the same scanner/generator path used for generated route modules.
3. Generate expected output source in memory.
4. Read existing output file.
5. Compare expected/current with normalized-newline comparison.
6. Return one of `current`, `missing`, `stale`, or `failed`.

Recommended internal implementation:

- factor scanner/generator source production into an internal helper
- keep public `generateFileRoutes(...)` behavior unchanged
- do not call write-path logic in check mode
- do not add public exports

Comparison strategy:

```txt
normalized newline comparison
```

Do not use byte-for-byte comparison in the first design because CRLF/LF differences would create cross-platform noise.

Do not use semantic comparison because it adds parser complexity and dependency pressure.

## 7. Missing output behavior

If output file does not exist:

```txt
status: missing
exit: 1
```

Output:

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Missing output is not invalid usage.

## 8. Generation failure behavior

If scanner/generator diagnostics fail:

```txt
status: failed
exit: 1
```

Output uses the same diagnostic format as `routes generate`:

```txt
File route generation failed:
- <CODE> <PATH> <MESSAGE>
```

Stack traces remain hidden by default.

## 9. Output policy

Success to stdout:

```txt
File routes are current:
- root: routes
- output: .potentia/routes.generated.js
- routes: 3
- scopes: 1
```

Missing output to stderr:

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Stale output to stderr:

```txt
File routes are stale:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Generation failure to stderr:

```txt
File route generation failed:
- <CODE> <PATH> <MESSAGE>
```

Invalid usage to stderr with usage text.

Do not print by default:

- generated source
- diff output
- stack traces
- route table dumps

## 10. Exit codes

Future check exit codes:

```txt
0 = generated output exists and is current
1 = generated output is missing, stale, or generation diagnostics failed
2 = invalid CLI usage/options
```

## 11. JSON decision

Decision:

```txt
design now, defer implementation
```

Future flag:

```bash
potentia routes check --json
```

Future shape:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "stale",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

Future statuses:

```txt
current
missing
stale
failed
invalid-usage
```

Do not implement JSON in the first check-mode foundation.

## 12. Docs / example future update

After check mode is implemented, README should show:

```bash
potentia routes generate
potentia routes check
```

Recommended docs order:

1. Generate routes
2. Use generated routes
3. Check generated output in CI
4. Programmatic API fallback
5. Deferred boundaries

`examples/file-routing-basic/README.md` should add a check command after generation and before running the app.

Do not add root package scripts solely for example-only route commands.

Programmatic API docs must remain first-class.

## 13. Deferred features

Still deferred:

- `potentia routes generate --check` alias
- `--json`
- `--watch`
- `--config`
- `--manifest`
- `--clean`
- `--verbose`
- `--silent`
- config files
- watch mode
- compiler/dev server
- route convention expansion
- route manifest file output
- real publish / release recovery

## 14. First implementation plan

Recommended next implementation block:

1. Preserve current `routes generate` behavior.
2. Extend parser to accept `routes check`.
3. Update usage text to include `generate|check`.
4. Factor internal scanner/generator source production so check can generate expected source without writing.
5. Implement normalized newline comparison.
6. Implement statuses: current, missing, stale, failed.
7. Add tests for parser, current/missing/stale/failure, no mutation, and invalid usage.
8. Add packed artifact CLI smoke for `routes check`.
9. Update README/example docs only after check works.

Implementation must not add root exports, dependencies, config, watch, dev server, or compiler behavior.

## 15. Recommendation

Recommendation:

```txt
A — Implement `potentia routes check`
```

Reason:

The design is clear, the minimal CLI foundation is already working, and check mode adds immediate CI value without expanding into watch/config/dev-server scope.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
