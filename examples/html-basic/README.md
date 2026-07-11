# HTML basic example

This example demonstrates the `@potentiajs/core/html` foundation planned for `0.2.0-preview.0`.

It shows:

- tagged `html` templates
- escaping interpolated values by default
- explicit trusted HTML with `raw(...)`
- attributes with `attrs(...)`
- fragments with `fragment(...)`
- route handlers returning `htmlResponse(...)`

Run from the repository root:

```bash
bun run examples/html-basic/index.js
```

The example is server-first and plain JavaScript. It does not use JSX, a compiler, hydration, a client runtime, or a virtual DOM.
