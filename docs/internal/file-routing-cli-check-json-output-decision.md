# File Routing CLI Check JSON Output Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-check-output-exit-decision.md`
- `docs/internal/file-routing-cli-check-stale-detection-decision.md`

## Decision

Design JSON output now, but defer implementation.

Chosen posture:

```txt
design now, defer implementation
```

## Rationale

Text-mode check is sufficient for the first CI-safe implementation:

```bash
potentia routes check
```

JSON output should be deferred because:

- it creates a machine-readable compatibility contract
- status names and diagnostic shape should be informed by text-mode usage
- check behavior should stabilize before adding output modes
- minimal CI use only needs exit codes plus concise text

## Future flag

Potential future command:

```bash
potentia routes check --json
```

Do not include `--json` in the first check implementation.

## Future JSON shape

Proposed shape:

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

## Status values

Future status values:

```txt
current
missing
stale
failed
invalid-usage
```

Status meanings:

- `current`: output exists and matches expected generated source
- `missing`: output file does not exist
- `stale`: output exists but differs after normalized-newline comparison
- `failed`: scanner/generator diagnostics failed
- `invalid-usage`: CLI options/command syntax invalid

## Output destination for future JSON

When implemented, JSON should probably print to stdout for all statuses so machines can parse it, while exit codes still communicate pass/fail.

If invalid usage prevents parsing flags, the command may still print text usage to stderr unless `--json` was already recognized. This edge case should be resolved in the JSON implementation block.

## Deferred

- `potentia routes check --json`
- `potentia routes generate --json`
- JSON diagnostic compatibility guarantees
- JSON invalid-usage parsing edge cases

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
