# 0.2.0-preview.1 Page Implementation

## Files changed

- `src/html.js`
- `docs/internal/020-preview1-page-implementation.md`

## Behavior

Implemented:

```js
export function page(options) {}
```

Behavior:

- `page(options)` returns a safe HTML value.
- `page()` renders an empty HTML document shell.
- `page(null)` is treated as empty options.
- Non-object / array options throw `TypeError`.
- `page(...)` includes `<!doctype html>`.
- `page(...)` includes `<html>` and `<body>`.
- `lang` defaults to `en`.
- `htmlAttrs` adds attributes to `<html>`.
- `bodyAttrs` adds attributes to `<body>`.
- `lang` wins over `htmlAttrs.lang`.
- charset meta is included by default.
- viewport meta is included by default.
- title is optional.
- title escapes by default.
- head accepts safe/plain children.
- body accepts safe/plain children.
- `children` aliases `body`.
- If both `body` and `children` are provided, `body` wins.
- `page(...)` does not return a `Response`; compose with `htmlResponse(page(...))`.

## Defaults

Head order:

1. `<meta charset="utf-8">`
2. `<meta name="viewport" content="width=device-width, initial-scale=1">`
3. `<title>...</title>` when present
4. caller-provided `head`

## Export posture

- Exported from `src/html.js`.
- Subpath only through existing `@potentiajs/core/html` export.
- No root export added.

## Blockers

None.
