# File Routing CLI JSON Docs Update

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-json-output-design-report.md`

## Files changed

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-json-docs-update.md`

## README updates

README now documents JSON output for existing CLI commands:

```bash
potentia routes generate --json
potentia routes check --json
```

It explains:

- JSON is for scripts and CI tooling
- JSON changes output format only
- `generate --json` still writes files
- `check --json` remains non-mutating
- JSON envelopes go to stdout
- exit codes remain the same
- watch/config/dev server/compiler remain unsupported

## Example README updates

`examples/file-routing-basic/README.md` now includes explicit JSON examples with the example paths:

```bash
potentia routes generate --json \
  --root examples/file-routing-basic/routes \
  --out examples/file-routing-basic/.potentia/routes.generated.js
potentia routes check --json \
  --root examples/file-routing-basic/routes \
  --out examples/file-routing-basic/.potentia/routes.generated.js
```

The generated-output policy notes that `--json` produces machine-readable stdout envelopes while preserving exit codes.

## Unsupported claims avoided

Docs do not claim:

- `routes watch`
- config files
- `generate --check`
- route convention expansion
- dev server/compiler behavior

## Blockers

None.

## Publish status

No publish command was run.
