# 0.2.0-preview.0 HTML Public API Smoke

## Temp project

```txt
/tmp/potentia-020-preview0-install-smoke
```

## Commands run

```bash
node html-smoke.mjs
```

## Results

```json
{
  "escapeHtml": true,
  "html": true,
  "raw": true,
  "attrs": true,
  "fragment": true,
  "htmlResponse": true
}
```

Confirmed from the public npm-installed package:

- `escapeHtml` escapes unsafe script text
- `html` escapes interpolated values
- `raw(...)` renders trusted content
- `attrs(...)` renders class arrays
- `fragment(...)` composes content
- `htmlResponse(...)` returns a `Response`
- `htmlResponse(...)` preserves body and sets `text/html; charset=utf-8`

## Safety

The smoke verified that unsafe script markup did not render as a real `<script>` tag and that explicit `raw(...)` trusted HTML rendered only through the trust boundary.

## Blockers

None.
