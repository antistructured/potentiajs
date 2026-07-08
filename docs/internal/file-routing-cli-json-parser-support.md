# File Routing CLI JSON Parser Support

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-output-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-json-output-design-report.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-json-parser-support.md`

## Parser behavior

Parser now accepts `--json` for existing route commands:

```bash
potentia routes generate --json
potentia routes check --json
```

`--json` can be combined with existing flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Usage text now includes `--json`:

```txt
Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>] [--json]
```

Deferred commands/flags remain rejected:

- `routes watch --json`
- `routes generate --check --json`
- `routes check --watch --json`
- `routes check --config --json`

Invalid usage now carries `json: true` when `--json` appears anywhere in args, allowing `main(...)` to emit a JSON invalid-usage envelope.

## Unsupported command status

No unsupported command was added.

## Blockers

None.

## Publish status

No publish command was run.
