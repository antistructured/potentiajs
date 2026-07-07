# File Routing Public Example Smoke

## Files inspected

- `examples/file-routing-basic/generate.js`
- `examples/file-routing-basic/app.js`
- `examples/file-routing-basic/routes/`
- existing file-routing tests

## Files changed

- `tests/file-routing-basic-example.test.js`
- `docs/internal/file-routing-public-example-smoke.md`

## Test flow

The smoke test:

1. removes `examples/file-routing-basic/.potentia/`
2. imports and runs `examples/file-routing-basic/generate.js`
3. reads generated `.potentia/routes.generated.js`
4. verifies generated output includes:
   - generated warning header
   - import from `@potentiajs/core`
   - explicit route module imports
   - no `node:fs` runtime filesystem import
5. imports `examples/file-routing-basic/app.js`
6. requests:
   - `/`
   - `/health`
   - `/users/ada`
7. verifies the users scoped hook headers
8. removes generated `.potentia/` output in `finally`

## Focused test result

```bash
bun test tests/file-routing-basic-example.test.js
```

Result:

```txt
1 pass
0 fail
17 expect() calls
```

## Generated output policy verified

Generated output is created during the test and cleaned afterward. It is not committed or shipped as a checked-in artifact.

## Blockers

None.

## Publish status

No publish command was run.
