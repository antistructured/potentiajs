# Changelog

## 0.2.0-preview.1

### Page and layout integration

- Added `page(...)` for HTML document shell composition.
- Added `layout(...)` for reusable server-first layout functions.
- Updated `examples/html-basic` to demonstrate page/layout composition.
- Updated `examples/full-flow-basic` to compose routing, actions, forms, and HTML page responses.

### Notes

- Page/layout helpers remain subpath-only through `@potentiajs/core/html`.
- JSX, compiler, hydration, virtual DOM, and client runtime behavior remain intentionally out of scope.

## 0.2.0-preview.0

### HTML-first response foundation

- Added `@potentiajs/core/html`.
- Added safe HTML values and escaping helpers.
- Added explicit trusted HTML through `raw(...)`.
- Added tagged `html` templates.
- Added `fragment(...)` composition.
- Added `attrs(...)` for safe attribute rendering.
- Added `htmlResponse(...)` for server-first HTML responses.
- Added `examples/html-basic`.

### Notes

- HTML helpers are subpath-only in this preview.
- JSX, compiler, hydration, virtual DOM, and client runtime behavior are intentionally out of scope.

## 0.1.0

### First public foundation

- Added the PotentiaJS application kernel.
- Added route declarations and route collections.
- Added contract projection for params, query, headers, body, and responses.
- Added action definitions and action projection.
- Added form state and form metadata projection.
- Added server-side HTML form rendering through `@potentiajs/core/forms`.
- Added file-routing generation through `@potentiajs/core/file-routing`.
- Added the `potentia routes generate` and `potentia routes check` CLI.
- Added public examples for file routing, form rendering, and full-flow usage.
- Published the package to npm and JSR.

### Notes

- PotentiaJS remains experimental under ZeroVer.
- `0.1.0` is not a 1.0 stability guarantee.
- JSX is intentionally not part of the official framework direction.

## 0.1.0-preview.1

### Registry hygiene

- Tightened the JSR artifact to exclude repo-only files.
- Preserved public JSR exports for root, file-routing, and forms.
- Added npm preview dist-tag verification posture.
- Preserved internal post-publish verification docs as project audit trail.

## 0.1.0-preview.0

Experimental public preview for `@potentiajs/core`.

PotentiaJS is still not production-ready and has no stable public API commitment. All root exports remain experimental and may change before a stable release.

### Highlights

- Added a Bun-first routing kernel for explicit, contract-driven request handling.
- Added explicit route composition with route collections and mounts.
- Added SigilJS request, response, and action contract boundaries.
- Added experimental effect descriptors and helpers.
- Added experimental actions with JSON input and URL-encoded form-compatible action input.
- Added normalized diagnostics for route/action validation failures.
- Added safe form state helper for failed form submissions.
- Added renderer-independent form projection metadata.
- Added route, action, manifest, and contract projection metadata.
- Added focused examples for kernel, SigilJS, composition, actions, and form state.
- Pruned root exports to the intentional public preview surface.

### Not included

- Stable API commitment.
- Production-readiness claim.
- Frontend runtime.
- Renderer or form generator.
- Client SDK.
- OpenAPI generator.
- Multipart/file upload helpers.
- Session/flash helpers.
- TypeScript source conversion.
- Public file-routing API.
- Package split.
- DB/auth integrations.

### Notes

- Runtime target: Bun.
- Source remains plain JavaScript ES modules.
- Runtime dependency: `@weipertda/sigiljs@0.18.0`.
- Minimal TypeScript declarations are included for editor/type discovery, but they are conservative and experimental.
- Post-release verification should confirm the registry artifact users receive.

