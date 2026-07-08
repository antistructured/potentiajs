# File Routing CLI Check Output / Exit Codes

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-check-output-exit-decision.md`
- `docs/internal/file-routing-cli-check-core.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-check-output-exit.md`

## Behavior

`potentia routes check` now maps check statuses to output and exit codes.

## Status mapping

```txt
current -> exit 0 -> stdout
missing -> exit 1 -> stderr
stale -> exit 1 -> stderr
failed -> exit 1 -> stderr
invalid usage -> exit 2 -> stderr
```

## Current output

```txt
File routes are current:
- root: routes
- output: .potentia/routes.generated.js
- routes: <count>
- scopes: <count>
```

## Missing output

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

## Stale output

```txt
File routes are stale:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

## Generation failure

Generation diagnostics reuse existing safe formatting:

```txt
File route generation failed:
- <CODE> <LOCATION> <MESSAGE>
```

Stack traces remain hidden by default.

## Invalid usage

Invalid usage prints updated usage text:

```txt
Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>]
```

and exits `2`.

## Deferred output modes

Not implemented:

- `--json`
- diff output
- verbose stack traces
- route table dumps

## Blockers

None.

## Publish status

No publish command was run.
