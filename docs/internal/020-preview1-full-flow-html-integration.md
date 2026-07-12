# 0.2.0-preview.1 Full-Flow HTML Integration

## Files changed

- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/README.md`
- `docs/internal/020-preview1-full-flow-html-integration.md`

## Integration

The full-flow example now composes routing, actions, forms, and HTML helpers:

- imports `html`, `htmlResponse`, `layout`, `page`, and `raw` from `@potentiajs/core/html`
- uses `layout(...)` for the shared page body shell
- uses `page(...)` for the document shell
- uses `htmlResponse(page(...))` for route responses
- wraps the already-rendered trusted form HTML with `raw(renderForm(...))`
- preserves interpolation escaping for dynamic user IDs and titles

## Flows preserved

Preserved:

- file-route generation
- `GET /`
- `GET /users/new`
- URL-encoded `POST /users`
- validation failure flow with status `400`
- domain failure flow with status `409`
- sensitive password value omission
- successful `303` redirect flow
- `GET /users/:id`

## Validation

Command:

```bash
bun test tests/full-flow-basic-example.test.js
```

Result:

```txt
1 pass
0 fail
35 expect() calls
```

## Blockers

None.
