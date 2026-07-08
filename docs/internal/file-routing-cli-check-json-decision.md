# File Routing CLI Check JSON Decision

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-json-envelope-decision.md`
- `docs/internal/file-routing-cli-check-output-exit.md`

## Decision

Future command:

```bash
potentia routes check --json
```

JSON mode changes output format only. Check mode remains non-mutating.

## Current shape

When output exists and is current:

```json
{
  "ok": true,
  "command": "routes check",
  "status": "current",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

Exit code remains `0`.

## Missing shape

When output does not exist:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "missing",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": [],
  "hint": "Run potentia routes generate"
}
```

Exit code remains `1`.

## Stale shape

When output differs after normalized-newline comparison:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "stale",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": [],
  "hint": "Run potentia routes generate"
}
```

Exit code remains `1`.

## Failed shape

When scanner/generator/read diagnostics fail:

```json
{
  "ok": false,
  "command": "routes check",
  "status": "failed",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 0,
  "scopes": 0,
  "diagnostics": []
}
```

Exit code remains `1`.

## Non-mutation rule

`routes check --json` must not write, delete, create, or rewrite generated output.

JSON must not imply:

- watch mode
- config files
- compiler/dev server
- route manifest output

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
