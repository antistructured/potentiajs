# 0.2.0 HTML Public API Proposal

## Subpath

```txt
@potentiajs/core/html
```

Decision: HTML helpers should live only in this subpath for `0.2.0`.

Rationale:

- `0.1.0` intentionally kept file-routing and forms as subpath exports.
- HTML helpers are foundational but not yet proven enough for root export.
- Subpath export keeps root stable and avoids accidental public API pollution.

## Root exports

Decision: no root exports for `0.2.0-preview.0`.

Potential future reconsideration:

- `htmlResponse` could become root-worthy if it becomes as core as `ok(...)`, `json(...)`, or `text(...)`.
- Do not root-export it until real usage proves the need.

## Proposed exports

### `html`

Purpose:

- create a safe HTML value from escaped dynamic pieces
- primary composition primitive for route-returned HTML

Input shape:

- recommended first shape: tagged template function
- possible secondary shape: `html(children)` only if implementation stays simple

Example shape:

```js
html`<h1>${title}</h1>`
```

Return shape:

- opaque safe HTML value
- stringifiable internally by helpers

Escaping behavior:

- interpolated strings/numbers/booleans escape by default
- safe HTML values are inserted without re-escaping
- arrays/fragments flatten recursively
- `null` / `undefined` render empty

Stability:

- stable enough for `0.2.0-preview.0` if kept small

Preview-only risk:

- exact callable shape may change during preview if tagged-template ergonomics are awkward

### `raw`

Purpose:

- mark trusted HTML as already safe

Input shape:

- `raw(value)` where `value` is expected to be a trusted string

Return shape:

- safe HTML value

Escaping behavior:

- no escaping
- caller is responsible for trust/safety

Stability:

- stable enough if deliberately named `raw`

Preview-only risk:

- may later require string-only input or a stronger trusted wrapper

### `escapeHtml`

Purpose:

- expose the same escaping behavior used internally
- useful for advanced users and tests

Input shape:

- `escapeHtml(value)`

Return shape:

- escaped string

Escaping behavior:

- escapes `&`, `<`, `>`, `"`, and `'`
- stringifies primitives conservatively

Stability:

- stable enough for `0.2.0-preview.0`

Preview-only risk:

- low

### `attrs`

Purpose:

- generate escaped HTML attributes from a plain object

Input shape:

- `attrs({ id: 'x', hidden: true, disabled: false })`

Return shape:

- safe HTML value or escaped attribute string; recommendation: safe HTML value

Escaping behavior:

- names validated against safe attribute-name pattern
- values escaped
- `true` boolean attrs render as bare attributes
- `false`, `null`, `undefined` omitted

Stability:

- stable if limited to primitive object values first

Preview-only risk:

- class/style object sugar should be deferred unless clearly needed

### `fragment`

Purpose:

- compose multiple children without wrapping element

Input shape:

- `fragment(...children)`

Return shape:

- safe HTML value

Escaping behavior:

- same as `html` child interpolation

Stability:

- stable enough for `0.2.0-preview.0`

Preview-only risk:

- low

### `htmlResponse`

Purpose:

- turn safe HTML / string / fragment into a standard web `Response`

Input shape:

- `htmlResponse(body, options?)`
- options may include `status`, `statusText`, and `headers`

Return shape:

- `Response`

Escaping behavior:

- if body is safe HTML, use it directly
- if body is a plain string, either escape it or require callers to pass `html(...)`; recommendation: escape plain string by default to preserve safety

Stability:

- stable enough for `0.2.0-preview.0`

Preview-only risk:

- name could change if `respondHtml` proves clearer, but recommendation is `htmlResponse` for noun consistency with existing `json(...)` / `text(...)` helpers.

### `page`

Purpose:

- create a full HTML document shell

Input shape:

- `page({ title, head, body, lang })`

Return shape:

- safe HTML value

Escaping behavior:

- title/lang escaped
- head/body composed with safe child behavior

Stability:

- preview-only in `0.2.0-preview.1`

Preview-only risk:

- moderate; document shell preferences vary

### `layout`

Purpose:

- compose shared shell around page content without introducing a component framework

Input shape:

- unresolved; likely `layout(fn)` or `layout(shell, content)`

Return shape:

- function or safe HTML value depending on chosen shape

Escaping behavior:

- same safe child behavior as `html`

Stability:

- preview-only in `0.2.0-preview.1`

Preview-only risk:

- high enough to defer out of `preview.0`

## Required decisions

### Should html helpers live only in subpath?

Decision: yes, subpath only for `0.2.0`.

### Should any helper be root-exported?

Decision: no root exports in `preview.0`.

### Should `html` be tagged template or function?

Recommendation: start with tagged template because it gives a familiar plain-JS authoring shape without JSX/compiler. Avoid clever additional DSL forms until usage proves them.

### Should `raw` be allowed?

Decision: yes, but explicit and documented as dangerous/trusted. No implicit raw path.

### Should `htmlResponse` be named `htmlResponse` or `respondHtml`?

Decision: `htmlResponse`.

Rationale:

- noun/helper naming matches response helper style
- clearer as a value-producing function
- avoids implying router middleware behavior

## Open API decisions

- exact public branding/type name for safe HTML values
- whether `String(safeHtml)` should be public/documented or internal only
- whether plain strings passed to `htmlResponse` escape or throw
- whether `attrs` should support class arrays in `preview.0`
- exact `page` and `layout` shape for `preview.1`

## Blockers

None for roadmap.
