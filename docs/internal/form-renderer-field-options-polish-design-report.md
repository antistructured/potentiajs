# Form Renderer Field Options Polish Design Report

## 1. Current renderer state

Current public renderer surface:

```txt
@potentiajs/core/forms → renderForm
```

Current renderer supports:

- `<form>` generation
- labels
- basic inputs: `text`, `email`, `url`, `tel`, `password`, `number`, `checkbox`
- options rendered as `<select>`
- `required`
- placeholders
- help text
- default values
- multiple scalar values as repeated controls
- state values
- root errors
- field errors
- opaque fallback
- sensitive value omission
- escaped HTML output

Current non-surface:

- no root `renderForm`
- no public `renderField`
- no public `escapeHtml`
- no raw HTML bypass
- no classNames/themes/slots/custom renderers
- no JSX/components
- no frontend runtime
- no hydration
- no compiler

## 2. Scope

This design gate defines the next layer of renderer polish only.

The target is:

```txt
contract-native HTML
```

not a component framework clone.

## 3. No-JSX / HTML-first law

Project law:

```txt
PotentiaJS does not use JSX as a framework direction.
```

Renderer polish must remain:

- HTML-first
- server-first
- metadata-driven
- state-aware
- escaped by default
- style-friendly
- progressively enhanceable later

It must not introduce JSX, a frontend runtime, hydration, VDOM identity, a component system, or compiler work.

## 4. Textarea policy

Decision:

```txt
Support textarea only when projection metadata explicitly asks for multiline rendering.
```

Initial signal:

```js
field.input === 'textarea'
```

Implementation may also tolerate:

```js
field.input.type === 'textarea'
```

given current normalized field metadata.

Behavior:

```html
<textarea id="..." name="...">escaped value</textarea>
```

Rules:

- escape value as text content
- support state/default values
- support placeholder
- support required
- support errors
- do not infer textarea from string length/name/value
- no rich text
- no raw HTML

## 5. Select/options policy

Decision:

```txt
Render <select> when finite options exist.
```

Supported option shapes:

```js
['user', 'admin']
```

and:

```js
[
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' }
]
```

Rules:

- escape option labels and values
- preserve option order
- selected value comes from state first, default value second
- do not invent empty option by default
- render only options provided by projection metadata
- defer multi-select polish

## 6. Hidden field policy

Decision:

```txt
Support hidden only when projection metadata explicitly asks for hidden rendering.
```

Initial signal:

```js
field.input === 'hidden'
```

Implementation may also tolerate:

```js
field.input.type === 'hidden'
```

Rules:

- render escaped value
- no label/help/errors inline by default
- do not infer hidden fields
- document that hidden values are never trusted
- server contracts/actions remain authoritative

## 7. Checkbox policy

Decision:

```html
<input type="checkbox" name="active" value="true">
```

Checked shape:

```html
<input type="checkbox" name="active" value="true" checked>
```

Checked state should use the existing conservative truthy values:

- `true`
- `'true'`
- `'on'`
- `'1'`
- `1`

Unchecked browser behavior remains native: no submitted value. Server validation remains authoritative.

## 8. Multiple scalar policy

Decision:

```txt
Keep current repeated-control behavior for multiple scalar values.
```

This is sufficient for simple repeated scalar values. Arrays-of-objects, repeaters, and field groups remain deferred.

## 9. Data attributes / styling policy

Decision:

```txt
data-potentia-* attributes are the first styling and testing contract.
```

Initial stable surface to implement:

```txt
data-potentia-form
data-potentia-form-errors
data-potentia-field
data-potentia-label
data-potentia-control
data-potentia-help
data-potentia-errors-for
data-potentia-submit
```

Users can style with regular CSS:

```css
[data-potentia-field] {
  display: grid;
  gap: 0.25rem;
}
```

ClassNames decision:

```txt
Defer classNames.
```

Reason:

- data attributes are enough for first styling/testing surface
- class API names should not stabilize too early
- avoids drifting into themes/slots/custom renderer APIs

## 10. Accessibility defaults

Decision:

```txt
Accessibility defaults are part of first polish implementation.
```

Baseline:

- labels use `for`
- controls use matching `id`
- help text gets stable IDs
- field errors get stable IDs
- controls with help/errors use `aria-describedby`
- controls with errors use `aria-invalid="true"`
- required fields use native `required`
- form-level errors render in a meaningful container
- errors render as escaped text

ARIA policy:

```txt
Use minimal ARIA. Prefer native HTML semantics first.
```

## 11. Deferred features

Deferred:

- classNames option
- themes
- slots
- custom renderers
- public `renderField`
- public `escapeHtml`
- raw HTML bypass
- fieldsets/groups
- arrays-of-objects/repeaters
- radio groups
- checkbox groups
- multi-select polish
- optgroups/disabled options
- rows/cols textarea policy
- rich text
- multipart/file inputs
- style scoping
- web component helpers
- frontend runtime
- hydration
- compiler/template integration

## 12. First implementation plan

Recommended next implementation block:

```txt
Form Renderer Field Options Polish Foundation
```

Implement later, in a narrow additive pass:

1. Add textarea rendering for explicit multiline metadata.
2. Refine select/options rendering without invented empty options.
3. Add explicit hidden input rendering.
4. Preserve checkbox policy.
5. Keep multiple scalar repeated-input behavior.
6. Add/standardize `data-potentia-*` attributes.
7. Add baseline accessibility attributes:
   - help/error IDs
   - `aria-describedby`
   - `aria-invalid`
8. Keep `renderField` internal.
9. Keep `escapeHtml` internal.
10. Do not add classNames, custom renderers, JSX, runtime, compiler, or hydration.

## 13. Recommendation

Recommendation:

```txt
A — Implement Field Options Polish Foundation
```

Reason:

The decisions are clear, scoped, and additive. They improve practical server-rendered forms while preserving the HTML-first/no-JSX architecture and avoiding framework/runtime drift.

## Source/API impact

None.

This design gate added documentation only. No source implementation, package export, dependency, README feature claim, runtime, compiler, or JSX work was added.

## Blockers

None.

## Publish status

No publish command was run.
