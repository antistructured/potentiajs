# File Routing CLI JSON Output / Exit Code Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-diagnostics-error-decision.md`
- `docs/internal/file-routing-cli-check-output-exit.md`

## Exit code decision

JSON mode preserves existing exit-code semantics:

```txt
0 = generated/current success
1 = failed/missing/stale/generation or IO error
2 = invalid usage/options
```

`--json` changes output format only.

## Output destination decision

Decision:

```txt
All valid JSON envelopes go to stdout, including failure envelopes.
Invalid usage with --json also goes to stdout when possible.
Non-JSON fatal process errors may go to stderr.
```

## Rationale

- tools can reliably parse stdout
- exit codes still communicate pass/fail
- stderr remains available for unexpected process-level failures
- JSON failure output on stderr would force automation to parse different streams by status

## Text mode remains unchanged

Text mode keeps current behavior:

```txt
success/current -> stdout
missing/stale/failed -> stderr
invalid usage -> stderr
```

## JSON mode examples

Success:

```txt
stdout: { "ok": true, ... }
exit: 0
```

Command failure:

```txt
stdout: { "ok": false, "status": "stale", ... }
exit: 1
```

Invalid usage with `--json`:

```txt
stdout: { "ok": false, "status": "invalid-usage", ... }
exit: 2
```

Unexpected non-JSON fatal process error:

```txt
stderr: Unexpected Potentia CLI failure: <message>
exit: 1
```

## Formatting

JSON should be compact single-object output by default.

Recommended first implementation:

```js
JSON.stringify(envelope) + '\n'
```

Pretty JSON can be deferred unless a later block introduces a `--pretty` or equivalent flag.

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
