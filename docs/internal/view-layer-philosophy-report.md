# View Layer Philosophy Report

## 1. Why this gate exists

Potentia now has enough HTML-adjacent capability to need a clear view-layer philosophy before adding more helpers:

- `renderForm(...)`
- `projectForm(...)`
- `createFormState(...)`
- actions and URL-encoded input
- normalized diagnostics
- file-route generation
- full-flow server-rendered example

Without a gate, form renderer polish could accidentally drift into JSX, component runtime, hydration, or compiler design. This report keeps the next work constrained.

## 2. Permanent no-JSX law

Project law:

```txt
PotentiaJS does not use JSX as a framework direction.
```

This is architectural, not temporary.

JSX should not appear in official examples, view-layer plans, renderer designs, or public API direction except as a rejected option.

## 3. HTML-first direction

Preferred direction:

```txt
HTML-first
server-first
regular HTML
style-friendly markup
contract-aware forms
progressive enhancement
web standards
Svelte-like ergonomics later if justified
```

Future templates, if any, should preserve HTML as the primary authoring surface rather than making JavaScript expressions the center of view authoring.

## 4. Relationship to renderForm(...)

`renderForm(...)` is the first narrow HTML projection helper.

It is not the complete view layer. It is not a component system, layout engine, compiler, template language, frontend runtime, or hydration model.

Its role is deliberately small:

```txt
form projection + optional form state → escaped server-side HTML string
```

It proves that Potentia can connect contracts/actions/state to useful server-rendered HTML without JSX.

## 5. Relationship to forms/actions/contracts

Potentia views should stay connected to existing framework primitives:

- contracts define server-trusted data boundaries
- actions define mutation boundaries
- form projection exposes safe metadata
- form state carries safe values/errors after failure
- redirects remain explicit
- server validation remains authoritative

The view layer should not replace these primitives. It should make them easier to present as HTML.

## 6. Web components posture

Web components are compatible with Potentia's future direction.

They should be treated as optional progressive enhancement over regular server-rendered HTML.

They should not become a required runtime, hydration layer, or replacement for server contracts/actions.

## 7. Progressive enhancement principle

Principle:

```txt
HTML works first. Web components enhance later.
```

Server-rendered pages and forms should remain useful without client JavaScript. Client behavior can enhance interactions later, but must not become required for basic app behavior.

## 8. Style direction

Style direction:

```txt
regular CSS first
style-friendly HTML attributes
no CSS-in-JS-first direction
style scoping deferred
```

Renderer/template helpers should produce inspectable, style-friendly markup. Future style scoping is a design topic, not a current implementation target.

## 9. Template direction

Template direction:

```txt
HTML-first templates if ever designed
no JSX
no VDOM-first architecture
```

Possible future exploration areas remain open:

- HTML-first files
- plain JS tagged templates
- projected template metadata
- Svelte-like single-file authoring later

No syntax is selected now.

## 10. Compiler boundary

Decision:

```txt
Do not build a view compiler yet.
```

A compiler may be considered later only if it preserves:

- HTML-first authoring
- server-first rendering
- inspectable output
- explicit contracts/actions/state
- progressive enhancement
- no JSX

## 11. Rejected directions

Rejected:

- JSX-first views
- React-like component trees
- virtual DOM as identity
- hydration-first app model
- client runtime as default
- CSS-in-JS-first direction
- compiler work before core primitives settle

## 12. Deferred decisions

Deferred:

- template syntax
- template file extension
- compiler architecture
- component model
- web component helper APIs
- CSS scoping
- style blocks
- client-side enhancement package
- hydration policy
- layout/slot model

## 13. Recommended next block

Recommendation:

```txt
A — Continue With Form Renderer Polish
```

Reason:

The view philosophy is now clear enough to continue narrow design work without drifting into JSX, runtime, compiler, or broad component architecture.

Recommended next block:

```txt
Form Renderer Polish / Field Options Design Gate
```

Scope for that next block should remain design-only:

- textarea policy
- select/options behavior
- classNames/style hooks
- field metadata extensions
- no JSX
- no frontend runtime
- no compiler

## Source/API impact

None.

This report added architecture documentation only. No source implementation, package export, dependency, compiler, runtime, or README feature claim was added.

## Blockers

None.

## Publish status

No publish command was run.
