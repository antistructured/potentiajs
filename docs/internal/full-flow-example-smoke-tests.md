# Full Flow Example Smoke Tests

## Files inspected

- `tests/*example*.test.js`
- `tests/file-routing-basic-example.test.js`
- `examples/full-flow-basic/`

## Files changed

- `tests/full-flow-basic-example.test.js`
- `docs/internal/full-flow-example-smoke-tests.md`

## Tests

Added:

```txt
tests/full-flow-basic-example.test.js
```

Coverage:

1. Cleans generated `.potentia/` output.
2. Runs full-flow example generation.
3. Verifies generated output:
   - generated header
   - imports from `@potentiajs/core`
   - route module imports
   - no `node:fs` runtime filesystem scanning
4. Imports generated app.
5. Verifies `GET /`.
6. Verifies `GET /users/new` rendered form.
7. Submits invalid URL-encoded form.
8. Verifies validation failure:
   - status `400`
   - field errors render
   - safe email value preserved
   - password value omitted
9. Submits domain-failure email.
10. Verifies domain failure:
    - status `409`
    - root form error renders
    - safe values preserved
    - password value omitted
11. Submits success input.
12. Verifies redirect:
    - status `303`
    - `Location: /users/ada`
13. Verifies `GET /users/ada`.
14. Cleans generated output.

Focused run:

```txt
1 pass
0 fail
35 expect() calls
```

## Blockers

None.

## Publish status

No publish command was run.
