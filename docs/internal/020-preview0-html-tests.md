# 0.2.0-preview.0 HTML Tests

## Files changed

- `tests/html.test.js`
- `docs/internal/020-preview0-html-tests.md`

## Tests added

Coverage added for:

- `escapeHtml` escaping `&`, `<`, `>`, `"`, and `'`
- `escapeHtml` handling `null`, `undefined`, numbers, booleans, and bigints
- `raw` preserving trusted HTML
- safe HTML branding rejecting accidental plain-object forgery
- `html` escaping interpolated values
- `html` preserving raw/safe values
- `html` flattening arrays
- `html` omitting `null` / `undefined`
- `html` throwing when called as a normal function
- `fragment` flattening without commas
- `attrs` escaping values
- `attrs` booleans and omitted values
- `attrs` class arrays
- `attrs` `className -> class`
- `attrs` escaping safe HTML values in attribute context
- `attrs` rejecting invalid names
- `attrs` rejecting event handler attributes in preview.0
- `htmlResponse` returning `Response`
- `htmlResponse` setting default content-type
- `htmlResponse` preserving existing content-type
- `htmlResponse` escaping plain strings
- subpath import surface
- root export cleanliness
- package and JSR metadata exposing `./html`

## Results

```bash
bun test tests/html.test.js
```

Result:

```txt
21 pass
0 fail
42 expect() calls
```

## Blockers

None.
