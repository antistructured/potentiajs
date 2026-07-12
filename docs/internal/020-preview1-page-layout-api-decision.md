# 0.2.0-preview.1 Page/Layout API Decision

## layout

Final shape:

```js
const appLayout = layout((props) => html`
  <main>
    <h1>${props.title}</h1>
    ${props.children}
  </main>
`);

const view = appLayout({
  title: 'Hello',
  children: html`<p>World</p>`
});
```

Decisions:

- `layout(render)` requires `render` to be a function.
- `layout(render)` returns a render function.
- The returned render function accepts one props object.
- If props are omitted, the render function uses `{}`.
- The render function passes the props object through unchanged.
- The render result is converted into a safe HTML value using the same child-rendering rules as `html` and `fragment`.
- Safe HTML results are preserved.
- Plain string results are escaped.
- Arrays flatten without comma joining.
- `null` and `undefined` render as empty.
- Errors from `render` are not swallowed.

Return type:

- `layout(render) -> (props?) => HtmlValue`

## page

Final shape:

```js
const view = page({
  title: 'Potentia',
  lang: 'en',
  head: html`<meta name="description" content="Example">`,
  body: html`<main>Hello</main>`
});
```

Input:

```js
page({
  title,
  lang = 'en',
  head,
  body,
  children,
  htmlAttrs,
  bodyAttrs
})
```

Decisions:

- `page(options)` returns `HtmlValue`.
- `page()` and `page(undefined)` are valid and render an empty HTML document shell.
- `page(...)` does not return a `Response`.
- Use `htmlResponse(page(...))` for HTTP responses.
- Doctype is included by default.
- `<html>` is included by default.
- `lang` defaults to `en`.
- `htmlAttrs` is supported for additional `<html>` attributes.
- `bodyAttrs` is supported for additional `<body>` attributes.
- `lang` wins over `htmlAttrs.lang` when both are provided.
- `<meta charset="utf-8">` is included by default.
- `<meta name="viewport" content="width=device-width, initial-scale=1">` is included by default.
- `<title>...</title>` is rendered only when `title` is not `null` or `undefined`.
- Title content escapes by default.
- `head` accepts the same `HtmlChild` values as `html` interpolation.
- `body` accepts the same `HtmlChild` values as `html` interpolation.
- `children` is accepted as a body alias for ergonomics.
- If both `body` and `children` are provided, `body` wins.

## Deferred

Deferred from preview.1:

- metadata DSL
- asset pipeline
- script/style helpers
- slots system
- component model
- CSS system
- routing integration
- page response option
- automatic form renderer wrapping
- template file format
- compiler
- JSX
- hydration/client runtime

## Blockers

None.
