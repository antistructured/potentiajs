# File Routing CLI Generate JSON Output

## Files inspected

- `src/cli.js`
- `src/dev/file-routing/writer.js`
- `docs/internal/file-routing-cli-generate-json-decision.md`
- `docs/internal/file-routing-cli-json-envelope-helper.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-generate-json-output.md`

## Behavior

Implemented JSON output for:

```bash
potentia routes generate --json
```

Success behavior:

- generated output is still written
- JSON envelope is emitted to stdout
- no human success text is emitted
- exit code remains `0`
- status is `generated`

Failure behavior:

- JSON envelope is emitted to stdout
- no human diagnostic text is emitted for command failures
- exit code remains `1`
- status is `failed`

Text-mode `routes generate` behavior is unchanged.

## Output destination

JSON command results go to stdout.

## Blockers

None.

## Publish status

No publish command was run.
