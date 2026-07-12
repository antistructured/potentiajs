# 0.2.0 Public API Final Review

## Files inspected

- `src/index.js`
- `src/index.d.ts`
- `src/html.js`
- `src/html.d.ts`
- `src/file-routing.js`
- `src/forms.js`
- `package.json`
- `jsr.json`
- `tests/html.test.js`

## Root exports

Live root export inventory:

```json
[
  "action",
  "call",
  "composeRoutes",
  "context",
  "createApp",
  "createFormState",
  "createFrameworkError",
  "createPlugin",
  "createRouteManifest",
  "createRoutes",
  "effect",
  "fail",
  "json",
  "mount",
  "ok",
  "projectAction",
  "projectContract",
  "projectForm",
  "projectRoute",
  "projectRoutes",
  "redirect",
  "route",
  "text",
  "value"
]
```

Root remains focused on the core kernel APIs:

- app creation
- routes / route collections / mounts
- results / response descriptors
- effects
- actions and projections
- forms metadata/state
- route manifests
- framework errors

## Subpath exports

Package subpaths:

- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`
- `@potentiajs/core/html`

Live file-routing subpath exports:

```json
[
  "generateFileRoutes"
]
```

Live forms subpath exports:

```json
[
  "renderForm"
]
```

Live HTML subpath exports:

```json
[
  "attrs",
  "escapeHtml",
  "fragment",
  "html",
  "htmlResponse",
  "layout",
  "page",
  "raw"
]
```

## Private internals

Confirmed exclusions:

- HTML helpers are not root-exported.
- `generateFileRoutes` is not root-exported.
- `renderForm` is not root-exported.
- CLI internals are not root-exported.
- internal safe HTML marker / branding is not exported.
- internal `PotentiaHtmlValue` class is not exported.

Live root pollution checks:

```json
{
  "rootHasHtml": [],
  "rootHasSubpathHelpers": []
}
```

## Type declarations

Root declarations remain focused on the root API.

HTML declarations include:

- `HtmlValue`
- `HtmlChild`
- `PageOptions`
- `LayoutRenderer`
- `escapeHtml(...)`
- `raw(...)`
- `html(...)`
- `fragment(...)`
- `layout(...)`
- `attrs(...)`
- `htmlResponse(...)`
- `page(...)`

## Package metadata exports

`package.json` exports:

- `.`
- `./file-routing`
- `./forms`
- `./html`

`jsr.json` exports:

- `.`
- `./file-routing`
- `./forms`
- `./html`

## Changes made

- Created `docs/internal/020-public-api-final-review.md`.
- No source/API changes were made in this pass.

## Blockers

None.
