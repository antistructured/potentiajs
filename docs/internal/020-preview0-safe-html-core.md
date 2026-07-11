# 0.2.0-preview.0 Safe HTML Core

## Files changed

- `src/html.js`
- `docs/internal/020-preview0-safe-html-core.md`

## Representation

Safe HTML values use an internal `PotentiaHtmlValue` class plus a module-local symbol marker:

```txt
HTML_VALUE = Symbol('PotentiaHTMLValue')
```

The marker is not exported.

A value counts as safe HTML only when:

- it is an object
- it has the module-local marker
- it is an instance of the module-local `PotentiaHtmlValue` class

This prevents plain strings and ordinary objects from accidentally being treated as trusted HTML.

## Internal helpers

Implemented internal helpers:

- `createHtmlValue(value)`
- `isHtmlValue(value)`
- `renderChild(value)`
- `renderChildren(values)`

Rules:

- safe values stringify to their trusted HTML content
- plain strings are escaped through `renderChild(...)`
- plain objects are escaped as their string representation, not trusted
- arrays flatten through child rendering
- `null` / `undefined` render empty

## Blockers

None.
