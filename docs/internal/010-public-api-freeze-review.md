# 0.1.0 Public API Freeze Review

## Files inspected

- `src/index.js`
- `src/index.d.ts`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/forms.js`
- `src/forms.d.ts`
- `package.json` exports
- `jsr.json` exports
- live ESM import audit

## Root exports

Live import from `./src/index.js` exposes exactly:

- `action`
- `call`
- `composeRoutes`
- `context`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRouteManifest`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `ok`
- `projectAction`
- `projectContract`
- `projectForm`
- `projectRoute`
- `projectRoutes`
- `redirect`
- `route`
- `text`
- `value`

## Subpath exports

### `@potentiajs/core/file-routing`

Exports:

- `generateFileRoutes`

Declaration file:

- `src/file-routing.d.ts`

### `@potentiajs/core/forms`

Exports:

- `renderForm`

Declaration file:

- `src/forms.d.ts`

## Package export maps

npm `package.json` exports:

- `.` -> `./src/index.js` with `./src/index.d.ts`
- `./file-routing` -> `./src/file-routing.js` with `./src/file-routing.d.ts`
- `./forms` -> `./src/forms.js` with `./src/forms.d.ts`

JSR `jsr.json` exports:

- `.` -> `./src/index.js`
- `./file-routing` -> `./src/file-routing.js`
- `./forms` -> `./src/forms.js`

## Private internals

Intentionally private / not root-exported:

- `generateFileRoutes` from root
- `renderForm` from root
- `main`
- `parseArgs`
- `checkFileRoutes`
- `createJsonEnvelope`
- `toJsonDiagnostics`
- file-routing scanner/generator/path-mapping internals
- form renderer internal `renderField` / escaping helpers
- kernel implementation modules except through root exports

## Boundary checks

Live import confirmed:

```txt
rootHasGenerateFileRoutes: false
rootHasRenderForm: false
rootHasMain: false
rootHasParseArgs: false
```

## Changes made

None. No API rename or export change was required.

## Blockers

None.
