# File Routing CLI JSON Diagnostics / Error Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-envelope-decision.md`
- `docs/internal/file-routing-cli-generate-json-decision.md`
- `docs/internal/file-routing-cli-check-json-decision.md`

## Diagnostic object shape

Use safe minimal diagnostic objects:

```json
{
  "code": "POTENTIA_FILE_ROUTE_COLLISION",
  "path": "routes/users/[id].js",
  "message": "Route collision"
}
```

Required fields:

```txt
code
message
```

Optional field:

```txt
path
```

`path` should use the same location preference as current text diagnostics, but mapped into one `path` field.

Location preference:

1. `filePath`
2. `relativePath`
3. `routePath`
4. `rootDir`
5. `outputFile`
6. omit `path` if unavailable

## Future diagnostic fields

Reserved for later, not first JSON implementation:

```txt
severity
details
```

## Do not expose

JSON diagnostics must not expose:

- stack traces
- raw thrown error objects
- raw `cause` strings by default
- generated source
- internal scanner/generator object dumps
- absolute paths by default when a relative/user-facing path is available

## Invalid usage JSON shape

When `--json` is present anywhere in args and invalid usage is detected, try to emit JSON invalid usage.

Recommended shape:

```json
{
  "ok": false,
  "command": null,
  "status": "invalid-usage",
  "diagnostics": [
    {
      "code": "POTENTIA_CLI_INVALID_USAGE",
      "message": "Usage: potentia routes <generate|check> [--root <dir>] [--out <file>] [--package <specifier>] [--cwd <dir>] [--json]"
    }
  ]
}
```

Exit code remains `2`.

## Command inference

Decision:

- `command: null` if command cannot be safely resolved
- use best-effort resolved command only when namespace and command are valid, such as `routes check --unknown --json`
- do not invent commands for malformed args

## Unknown flags before command

Current CLI grammar has command tokens before flags. If `--json` appears anywhere in args, JSON invalid usage should be attempted when possible even if the command is invalid.

Examples:

- `potentia --json` -> JSON invalid usage if implementation can detect it
- `potentia routes unknown --json` -> JSON invalid usage
- `potentia routes check --json --watch` -> JSON invalid usage

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
