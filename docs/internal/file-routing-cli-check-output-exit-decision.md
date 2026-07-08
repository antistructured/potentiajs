# File Routing CLI Check Output / Exit Code Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-diagnostics-output-decision.md`
- `docs/internal/file-routing-cli-check-stale-detection-decision.md`

## Exit code decision

Future `potentia routes check` exit codes:

```txt
0 = generated output exists and is current
1 = generated output is missing, stale, or generation diagnostics failed
2 = invalid CLI usage/options
```

Rationale:

- CI should fail on stale/missing generated routes
- generation diagnostics are command success/failure, not syntax errors
- invalid options remain distinct usage errors

## Output destinations

```txt
current success -> stdout
missing output -> stderr
stale output -> stderr
generation failure -> stderr
invalid usage -> stderr
```

No stack traces by default.

## Success output

When output exists and is current:

```txt
File routes are current:
- root: routes
- output: .potentia/routes.generated.js
- routes: 3
- scopes: 1
```

## Missing output

When output does not exist:

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Exit code: `1`.

## Stale output

When output differs from expected generated source:

```txt
File routes are stale:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Exit code: `1`.

## Generation failure

When scanner/generator diagnostics fail:

```txt
File route generation failed:
- <CODE> <PATH> <MESSAGE>
```

Exit code: `1`.

Diagnostic location preference should match current `formatDiagnostic(...)` behavior:

1. `filePath`
2. `relativePath`
3. `routePath`
4. `rootDir`
5. `outputFile`
6. no location if unavailable

## Invalid usage

Invalid usage should reuse parser usage output and exit `2`.

Once check is implemented, usage should probably become:

```txt
Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>]
```

Examples of invalid usage:

- `potentia routes check --watch`
- `potentia routes check --json` in the first text-only check implementation
- `potentia routes check --root`
- `potentia routes unknown`

## Output not included initially

Do not include by default:

- full generated source
- diff output
- stack traces
- route table dump
- absolute paths unless already supplied or needed by diagnostics

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
