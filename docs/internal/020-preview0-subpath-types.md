# 0.2.0-preview.0 Subpath Exports + Types

## Files changed

- `src/html.d.ts`
- `package.json`
- `jsr.json`
- `docs/internal/020-preview0-subpath-types.md`

## Package exports

Added:

```json
"./html": {
  "types": "./src/html.d.ts",
  "import": "./src/html.js"
}
```

## JSR exports

Added:

```json
"./html": "./src/html.js"
```

## Types

Added conservative declaration surface:

- `HtmlValue`
- `HtmlChild`
- `escapeHtml(value)`
- `raw(value)`
- `html(strings, ...values)`
- `fragment(...children)`
- `attrs(attributes)`
- `htmlResponse(body, init)`

## Root exports

No root exports were added. `src/index.js` remains unchanged.

## Blockers

None.
