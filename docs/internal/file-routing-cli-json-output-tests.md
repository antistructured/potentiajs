# File Routing CLI JSON Output Tests

## Files inspected

- `tests/file-routing-cli.test.js`
- `src/cli.js`
- `docs/internal/file-routing-cli-json-parser-support.md`
- `docs/internal/file-routing-cli-json-envelope-helper.md`
- `docs/internal/file-routing-cli-generate-json-output.md`
- `docs/internal/file-routing-cli-check-json-output.md`

## Files changed

- `tests/file-routing-cli.test.js`
- `docs/internal/file-routing-cli-json-output-tests.md`

## Tests added

Parser coverage:

- parses `routes generate --json`
- parses `routes check --json`
- preserves existing flags/defaults with `json: true/false`
- rejects deferred flags/commands with JSON present

Envelope/diagnostic coverage:

- `createJsonEnvelope(...)` uses `package` field
- `toJsonDiagnostics(...)` emits safe `{ code, path?, message }` objects
- absolute paths/raw causes are not exposed in JSON diagnostics

Generate JSON coverage:

- `routes generate --json` success emits stdout JSON, writes output, exits `0`
- `routes generate --json` failure emits stdout JSON with `failed`, exits `1`, keeps stderr empty

Check JSON coverage:

- missing emits status `missing`, exits `1`, includes hint, does not write output
- current emits status `current`, exits `0`
- stale emits status `stale`, exits `1`, includes hint, does not rewrite output
- failed emits status `failed`, exits `1`

Invalid usage JSON coverage:

- invalid unresolved command with `--json` emits `invalid-usage` JSON to stdout and exits `2`
- invalid resolved command with `--json` keeps best-effort command and exits `2`
- stderr remains empty for JSON invalid-usage envelopes
- no stack traces are exposed

## Focused verification

```txt
bun test tests/file-routing-cli.test.js
28 pass
0 fail
162 expect() calls
```

## Blockers

None.

## Publish status

No publish command was run.
