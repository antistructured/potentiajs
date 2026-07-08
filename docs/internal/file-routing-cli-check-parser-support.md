# File Routing CLI Check Parser Support

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-check-mode-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-check-command-shape-decision.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-check-parser-support.md`

## Parser behavior

`parseArgs(...)` now accepts both commands:

```bash
potentia routes generate
potentia routes check
```

Supported flags for both commands:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Updated usage text:

```txt
Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>]
```

The parser returns command identity as:

```txt
routes generate
routes check
```

## Deferred flags remain rejected

The parser still rejects unsupported flags, including:

```bash
potentia routes check --json
potentia routes check --watch
potentia routes check --config
potentia routes generate --check
```

These return invalid usage and exit code `2` through `main(...)`.

## Unsupported commands remain rejected

Examples rejected:

```bash
potentia routes unknown
potentia routes watch
potentia dev
potentia build
```

## Blockers

None.

## Publish status

No publish command was run.
