# 0.2.0-preview.1 Layout Implementation

## Files changed

- `src/html.js`
- `docs/internal/020-preview1-layout-implementation.md`

## Behavior

Implemented:

```js
export function layout(render) {}
```

Behavior:

- `layout(render)` requires a function.
- Non-functions throw `TypeError`.
- `layout(render)` returns a render function.
- Returned render function accepts a props object.
- If props are omitted, `{}` is used.
- Render function receives the props object.
- Render result is converted to a safe HTML value.
- Safe HTML results are preserved.
- Plain string render results are escaped.
- Arrays/fragments flatten without comma joining.
- `null` and `undefined` render empty.
- Errors from the render function are not swallowed.

## Export posture

- Exported from `src/html.js`.
- Subpath only through existing `@potentiajs/core/html` export.
- No root export added.

## Blockers

None.
