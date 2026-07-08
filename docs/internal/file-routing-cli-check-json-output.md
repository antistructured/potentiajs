# File Routing CLI Check JSON Output

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-check-json-decision.md`
- `docs/internal/file-routing-cli-json-envelope-helper.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-check-json-output.md`

## Behavior

Implemented JSON output for:

```bash
potentia routes check --json
```

Status mapping:

```txt
current -> ok true -> stdout JSON -> exit 0
missing -> ok false -> stdout JSON -> exit 1 -> hint included
stale -> ok false -> stdout JSON -> exit 1 -> hint included
failed -> ok false -> stdout JSON -> exit 1
```

`routes check --json` remains non-mutating:

- does not create `.potentia/`
- does not write missing output
- does not rewrite stale output
- does not delete output

Text-mode `routes check` behavior is unchanged.

## Output destination

All check JSON command results go to stdout. Expected stderr is empty for command results unless a fatal process-level non-JSON error occurs.

## Blockers

None.

## Publish status

No publish command was run.
