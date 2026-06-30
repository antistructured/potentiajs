# Projection Metadata Example

## Files inspected

- `examples/composed-basic/index.js`
- `tests/composed-basic-example.test.js`
- `src/kernel/route-projection.js`

## Files changed

- `tests/kernel-projection-metadata-example.test.js`
- `docs/internal/projection-metadata-example.md`

## Example behavior

The composed basic app is now used as a projection metadata example without adding a public docs generator.

The test demonstrates that `projectRoutes(app)` can list:

- route methods
- route paths
- contract boundaries
- scoped contract defaults
- safe SigilJS field summaries
- hook counts

Example projected route list:

```txt
GET /
GET /api/users
GET /api/users/:id
POST /api/users
GET /health
```

## Safety behavior

The example only inspects existing route/app descriptors. It does not execute:

- handlers
- hooks
- contracts
- HTTP requests

## Verification

```bash
bun test tests/kernel-projection-metadata-example.test.js tests/composed-basic-example.test.js
```

Result:

- 10 pass
- 0 fail

## Deferred

- public docs generator
- OpenAPI generator
- JSON Schema expansion beyond projection metadata
- client SDK generation
- form/action generation
