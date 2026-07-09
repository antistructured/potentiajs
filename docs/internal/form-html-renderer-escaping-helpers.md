# Form HTML Renderer Escaping Helpers

## Files inspected

- `src/forms.js`
- `docs/internal/form-html-renderer-escaping-policy-decision.md`

## Files changed

- `src/forms.js`
- `docs/internal/form-html-renderer-escaping-helpers.md`

## Helpers

Implemented internal helpers:

- `escapeHtml(value)`
- `escapeAttribute(value)`
- `renderAttributes(attributes)`
- `normalizeMethod(method)`
- `normalizeEncType(encType)`
- `safeIdPart(value)`

These helpers are not public exports.

## Escaping behavior

Escapes:

- `&`
- `<`
- `>`
- `"`
- `'`

All dynamic text and attributes flow through escaping or safe normalization before rendering.

## Method / enctype behavior

- `GET` and `POST` are allowed.
- lowercase methods normalize to uppercase.
- unsupported methods fall back to `POST`.
- enctype is constrained to `application/x-www-form-urlencoded`.
- unsupported enctype falls back to URL-encoded.

## ID behavior

IDs are deterministic and normalized with unsafe characters replaced by `-`.

## Blockers

None.

## Publish status

No publish command was run.
