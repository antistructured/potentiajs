# File Routing CLI Generate JSON Decision

## Files inspected

- `src/cli.js`
- `src/dev/file-routing/writer.js`
- `docs/internal/file-routing-cli-json-envelope-decision.md`

## Decision

Future command:

```bash
potentia routes generate --json
```

JSON mode changes output format only. It must still write generated output exactly like text-mode `routes generate`.

## Success shape

On successful generation:

```json
{
  "ok": true,
  "command": "routes generate",
  "status": "generated",
  "root": "routes",
  "output": ".potentia/routes.generated.js",
  "package": "@potentiajs/core",
  "routes": 3,
  "scopes": 1,
  "diagnostics": []
}
```

Exit code remains `0`.

## Failure shape

On scanner/generator/write failure:

```json
{
  "ok": false,
  "command": "routes generate",
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

## Write behavior

`routes generate --json` still writes files.

Rules:

- successful generate writes output
- write failures are reported as `failed`
- previous write-preservation semantics remain unchanged
- generated source is not printed in JSON
- no route modules are executed

## Diagnostics

Failures should populate `diagnostics` using the shared diagnostic shape:

```json
{
  "code": "POTENTIA_FILE_ROUTE_COLLISION",
  "path": "routes/users/[id].js",
  "message": "Route collision"
}
```

## Deferred

Do not include in first JSON implementation:

- generated source text
- diff output
- manifest data
- route table dumps
- verbose stack traces

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
