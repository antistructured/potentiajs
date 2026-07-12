# 0.2.0-preview.1 HTML Basic Example Update

## Files changed

- `examples/html-basic/index.js`
- `examples/html-basic/README.md`
- `docs/internal/020-preview1-html-basic-example-update.md`

## Example demonstrates

The updated example now demonstrates:

- `layout(...)` for reusable server-first page layout
- `page(...)` for document shell composition
- `htmlResponse(page(...))` for route responses
- `attrs(...)` for safe attributes
- `fragment(...)` for child composition
- `raw(...)` as explicit trusted HTML boundary
- escaped user content by default

## Validation

Command:

```bash
bun run examples/html-basic/index.js
```

Result:

- status: `200`
- content type: `text/html; charset=utf-8`
- body includes `<!doctype html>`
- body includes layout-rendered `<main>`
- unsafe user text escaped
- trusted raw HTML preserved only through `raw(...)`

## Blockers

None.
