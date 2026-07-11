# 0.2.0-preview.0 HTML Example + Docs

## Files changed

- `examples/html-basic/README.md`
- `examples/html-basic/index.js`
- `README.md`
- `docs/internal/020-preview0-html-example-docs.md`

## Example

Added `examples/html-basic`.

It demonstrates:

- tagged `html` templates
- escaped interpolation by default
- explicit trusted HTML through `raw(...)`
- attributes through `attrs(...)`
- fragments through `fragment(...)`
- route handler returning `htmlResponse(...)`

Verification run:

```bash
bun run examples/html-basic/index.js
```

Result:

```txt
status: 200
content-type: text/html; charset=utf-8
body includes escaped user text and explicit trusted raw HTML
```

## README

Added a concise `HTML-first responses` section documenting:

- `@potentiajs/core/html`
- safe escaping by default
- `raw(...)` trust boundary
- `attrs(...)`
- `fragment(...)`
- `htmlResponse(...)`
- no JSX / compiler / VDOM / client runtime posture
- subpath-only preview.0 export stance

## Blockers

None.
