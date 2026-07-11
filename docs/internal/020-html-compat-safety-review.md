# 0.2.0 HTML Compatibility / Safety Review

## Compatible with

### Route handlers

The HTML layer should work as a normal route-handler return path:

```js
route('GET', '/', () => htmlResponse(html`<h1>Hello</h1>`))
```

Compatibility rule:

- no route matcher changes
- no new handler protocol required
- `htmlResponse(...)` returns a standard `Response`

### Existing response helpers

Existing helpers remain unchanged:

- `ok(...)`
- `json(...)`
- `text(...)`
- `redirect(...)`
- `fail(...)`

Compatibility rule:

- HTML helpers do not replace existing response helpers
- `htmlResponse(...)` is additive and should compose with normal route returns

### Forms renderer

Existing `@potentiajs/core/forms` export remains:

- `renderForm(...)`

Compatibility rule:

- no forced rewrite of `renderForm(...)`
- form-rendered strings can be explicitly trusted through `raw(...)` if needed
- a later pass may choose to brand renderer output as safe HTML, but that is not required for `preview.0`

### Actions/forms failure states

Compatibility rule:

- `createFormState(...)`, `projectForm(...)`, and action failure metadata remain unchanged
- HTML helpers may make re-rendering form failures cleaner
- no change to action success/failure semantics

### File-routing generated routes

Compatibility rule:

- generated route modules continue importing from `@potentiajs/core`
- route files may opt into `@potentiajs/core/html`
- file-routing scanner/generator does not need to understand HTML helpers

### Bun Response

Compatibility rule:

- output is a standard web `Response`, compatible with Bun
- no Bun-specific `Bun.*` APIs required

### Node-compatible web Response

Compatibility rule:

- use standard `Response`, `Headers`, and string body behavior
- avoid Bun-only APIs so smoke tests can run under Node where possible

### JSR artifact

Compatibility rule:

- add `./html` JSR export only when implementation exists
- include `src/html.js` and `src/html.d.ts` in JSR lean artifact
- keep examples/CLI/docs excluded from JSR artifact

### npm artifact

Compatibility rule:

- add `./html` package export and types only when implementation exists
- examples can ship to npm intentionally
- internal docs remain excluded

### Plain JS no-dependency posture

Compatibility rule:

- no runtime dependency additions for HTML helpers
- implementation should be plain JavaScript, small, and deterministic

## Safety rules

### Escape by default

- dynamic text interpolated into `html` escapes by default
- `fragment(...)` escapes plain strings
- `htmlResponse(...)` should not make unsafe plain strings easier to leak

### Raw requires explicit trusted wrapper

- raw insertion requires `raw(...)`
- docs must call `raw(...)` trusted/dangerous
- no implicit bypass from objects with custom methods unless branded by Potentia

### Attribute names and values

- attribute names must be validated against a conservative pattern
- invalid names should throw rather than render
- values escape by default
- dangerous raw attribute names are never accepted

### Boolean attributes

- `true` renders a bare attribute, e.g. `disabled`
- `false` omits the attribute

### Null/undefined attr omission

- `null` and `undefined` omit attributes
- `false` omits attributes
- empty string renders as `name=""`

### Children flattening

- nested arrays flatten recursively
- fragments flatten as safe HTML
- `null` / `undefined` children render empty
- booleans should either render empty or escaped string by explicit rule; recommendation: empty for `false`, empty for `true` unless inside attrs

### Arrays/fragments behavior

- arrays are composition containers, not joined with commas
- fragments preserve child order
- no hidden async rendering in `preview.0`

### Response content-type behavior

- default `Content-Type`: `text/html; charset=utf-8`
- caller headers can add additional headers
- caller-provided `Content-Type` should be respected if explicit

## Risks

### XSS through `raw(...)`

Risk:

- users may pass untrusted strings to `raw(...)`.

Mitigation:

- dangerous name
- docs warning
- tests showing `html` escapes by default and `raw` bypasses only explicitly

### Over-designing a component model

Risk:

- `layout(...)` and `page(...)` could drift toward React-like components.

Mitigation:

- defer layout/page to `preview.1`
- keep `preview.0` to low-level primitives
- no JSX, no VDOM, no component lifecycle

### Root API pollution

Risk:

- HTML helpers could become too visible too soon.

Mitigation:

- subpath only: `@potentiajs/core/html`
- no root exports in `0.2.0-preview.0`

### Form renderer interop ambiguity

Risk:

- `renderForm(...)` returns a string, while HTML helpers use safe values.

Mitigation:

- in `preview.0`, require explicit `raw(renderForm(...))`
- consider branded form output later only if needed

### JSR/npm export drift

Risk:

- npm and JSR exports could get out of sync.

Mitigation:

- implementation pass must update `package.json`, `jsr.json`, types, tests, npm pack dry-run, JSR dry-run

## Blockers

None for roadmap.
