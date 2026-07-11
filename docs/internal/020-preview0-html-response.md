# 0.2.0-preview.0 HTML Response Helper

## Files changed

- `src/html.js`
- `docs/internal/020-preview0-html-response.md`

## Export

Added:

- `htmlResponse(body, init)`

## Behavior

`htmlResponse(...)` returns a standard web `Response`.

Rules:

- safe HTML body renders trusted HTML
- plain string body escapes by default
- numbers, booleans, and bigints render through safe child rendering
- `null` / `undefined` body renders empty
- arrays/fragments render safely
- supports `status`, `statusText`, and other `ResponseInit` options

## Headers

Default content type:

```txt
text/html; charset=utf-8
```

Header rules:

- provided headers are preserved
- `content-type` is set only when absent
- caller-provided `Content-Type` is respected

## Blockers

None.
