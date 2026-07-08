# File Routing CLI JSON Output Foundation Scope Lock

## Files inspected

- `src/cli.js`
- `tests/file-routing-cli.test.js`
- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-json-output-design-report.md`
- `docs/internal/file-routing-cli-json-envelope-decision.md`
- `docs/internal/file-routing-cli-generate-json-decision.md`
- `docs/internal/file-routing-cli-check-json-decision.md`
- `docs/internal/file-routing-cli-json-diagnostics-error-decision.md`
- `docs/internal/file-routing-cli-json-output-exit-decision.md`

## Scope

This block implements JSON output for exactly two existing file-routing CLI commands:

```bash
potentia routes generate --json
potentia routes check --json
```

The existing text commands remain supported:

```bash
potentia routes generate
potentia routes check
```

Supported flags remain:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
--json
```

## Output-only rule

JSON changes output format only.

It must not change:

- generation behavior
- check behavior
- generated source contents
- route scanning behavior
- diagnostics safety
- route conventions
- package exports
- package metadata

## Exit-code preservation

Exit codes remain unchanged:

```txt
0 = generated/current success
1 = failed/missing/stale/generation or IO error
2 = invalid usage/options
```

## Command behavior

`routes generate --json`:

- still writes generated output on success
- emits JSON to stdout
- emits no human success text
- exits `0` on success and `1` on command failure

`routes check --json`:

- still never writes, creates, deletes, or rewrites generated output
- emits JSON to stdout for current/missing/stale/failed
- exits `0` for current and `1` for missing/stale/failed

Invalid usage with `--json` anywhere:

- attempts JSON invalid-usage envelope
- writes JSON to stdout when possible
- exits `2`
- emits no stack trace

## Out of scope

Do not implement in this block:

- `routes watch`
- config files
- `routes generate --check`
- route convention expansion
- compiler/dev server
- route manifest output
- pretty JSON
- diff output
- package root API changes
- file-routing subpath changes
- release/publish fixes
- real publish

## Forbidden behavior

JSON mode must not:

- expose stack traces
- expose raw thrown errors
- expose internal object dumps
- print generated source
- alter stdout/stderr behavior for text mode
- add new dependencies
- change package name/version/bin

## Blockers

None.

## Publish status

No publish command was run.
