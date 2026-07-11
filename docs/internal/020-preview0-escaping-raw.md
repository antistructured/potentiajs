# 0.2.0-preview.0 Escaping + Raw Trust Boundary

## Files changed

- `src/html.js`
- `docs/internal/020-preview0-escaping-raw.md`

## Exports

Added:

- `escapeHtml(value)`
- `raw(value)`

## Behavior

### `escapeHtml(value)`

Escapes:

- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#39;`

Input behavior:

- `null` / `undefined` → empty string
- numbers, booleans, bigints → string, then escaped
- strings → escaped
- internal safe HTML values return their trusted content unchanged

### `raw(value)`

Creates an explicitly trusted safe HTML value.

Rules:

- `raw('<strong>x</strong>')` renders as `<strong>x</strong>`
- `raw(null)` renders empty
- `raw(undefined)` renders empty
- raw does not escape

## Safety posture

`raw(...)` is the explicit trust boundary. It is intentionally named as a low-level escape hatch and must not be used with untrusted input.

## Blockers

None.
