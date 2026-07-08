# File Routing CLI JSON Output Scope Lock

## Files inspected

- `src/cli.js`
- `tests/file-routing-cli.test.js`
- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-check-mode-design-report.md`
- `docs/internal/file-routing-cli-check-mode-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-check-output-exit.md`
- `docs/internal/file-routing-cli-check-docs-update.md`

## Current CLI text behavior

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

Current text behavior:

- `routes generate` writes generated output and reports human-readable success/failure.
- `routes check` verifies output without writing and reports human-readable current/missing/stale/failure states.
- invalid usage prints usage text and exits `2`.
- stack traces are hidden by default.

Current check behavior:

```txt
current -> exit 0 -> stdout
missing -> exit 1 -> stderr
stale -> exit 1 -> stderr
failed -> exit 1 -> stderr
invalid usage -> exit 2 -> stderr
```

## Why JSON output is being designed

Text output is good for humans, but automation eventually needs stable machine-readable output for:

- CI jobs
- editor/tooling integrations
- package scripts that want structured results
- future wrappers that need diagnostics without parsing prose

Core law:

```txt
Text output is for humans.
JSON output is for tools.
```

## Scope for this block

This block designs JSON output only.

Target decisions:

- shared JSON envelope
- generate JSON success/failure shapes
- check JSON current/missing/stale/failed shapes
- status values
- diagnostics shape
- invalid usage JSON shape
- stdout/stderr policy
- exit-code preservation
- implementation recommendation

## Explicitly forbidden in this block

Do not change:

- `src/cli.js`
- parser behavior
- tests
- package metadata
- README public claims that `--json` exists
- example README public claims that `--json` exists
- package root exports
- file-routing subpath exports

Do not implement:

- `--json`
- watch mode
- config files
- compiler/dev server
- route convention expansion
- release/publish fixes
- real publish

## JSON output law

Future `--json` must change output format only.

It must not change:

- generation write behavior
- check non-mutating behavior
- diagnostic semantics
- file-writing behavior
- exit codes
- command semantics

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
