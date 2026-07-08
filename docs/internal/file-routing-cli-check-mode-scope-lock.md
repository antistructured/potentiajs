# File Routing CLI Check Mode Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `bin/potentia.js`
- `src/cli.js`
- `src/dev/file-routing/`
- `src/dev/file-routing/writer.js`
- `src/file-routing.js`
- `examples/file-routing-basic/`
- `examples/file-routing-basic/README.md`
- `tests/file-routing-cli.test.js`
- `docs/internal/file-routing-minimal-cli-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-design-gate-report.md`
- `docs/internal/file-routing-minimal-cli-package-smoke.md`

## Current CLI behavior

Implemented CLI:

```bash
potentia routes generate
```

Supported flags:

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

Current behavior:

- parses `routes generate`
- rejects unknown commands/options
- calls `generateFileRoutes(...)`
- writes `.potentia/routes.generated.js`
- prints success to stdout
- prints generation/usage failures to stderr
- exits `0`, `1`, or `2` according to the minimal CLI contract

Current implementation files:

- `bin/potentia.js`
- `src/cli.js`

Current exports:

- package root does not export CLI internals
- package root does not export `generateFileRoutes`
- `@potentiajs/core/file-routing` exports only `generateFileRoutes`

## Why check mode is next

The minimal CLI can generate routes, but CI needs a safe verification command that confirms generated output is current without rewriting project files.

Check mode is the next useful polish layer because it supports:

- CI validation
- pre-commit / pre-push verification
- confidence that `.potentia/routes.generated.js` matches `routes/`
- no runtime behavior changes
- no watch/config/compiler scope expansion

Core design message:

```txt
generate writes. check verifies.
```

## Scope for this block

This block is design-only for check mode.

Target design decisions:

- command shape
- alias posture
- flags/defaults
- stale-output detection
- missing-output behavior
- generation failure behavior
- output destinations and text
- exit codes
- future JSON shape
- future docs/example update plan
- first implementation recommendation

## Explicitly out of scope

Do not implement or change:

- `src/cli.js`
- `bin/potentia.js`
- `package.json`
- root exports
- file-routing subpath exports
- tests
- README check-mode claims
- example check-mode claims
- `potentia routes check`
- `potentia routes generate --check`
- `--json`
- watch mode
- config files
- compiler/dev server
- route convention expansion
- route manifest output
- release/publish recovery
- real publish

## Non-mutation law

Future check mode must not mutate project files.

Allowed future flow:

```txt
read routes/
generate expected source in memory
read existing output
compare
exit 0 or 1
```

Forbidden future check behavior:

```txt
rewrite output file
clean generated output
start watcher
start dev server
scan filesystem during requests
```

## Blockers

None.

## Implementation status

No implementation was added in this block pass.

## Publish status

No publish command was run.
