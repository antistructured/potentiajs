# CLI Package Export Boundary Verification

## Files inspected

- `src/index.js`
- `src/file-routing.js`
- `src/forms.js`
- `package.json`
- live ESM import audit

## Root API

`src/index.js` exports framework root APIs only.

Live audit confirmed the root API does not export:

- `generateFileRoutes`
- `renderForm`
- `main`
- `parseArgs`
- `checkFileRoutes`
- `createJsonEnvelope`
- `toJsonDiagnostics`

## Subpath APIs

`@potentiajs/core/file-routing` remains the file-routing subpath and exports:

```txt
generateFileRoutes
```

`@potentiajs/core/forms` remains the forms renderer subpath and exports:

```txt
renderForm
```

## npm exports

`package.json` keeps npm conditional exports:

```json
{
  ".": {
    "types": "./src/index.d.ts",
    "import": "./src/index.js"
  },
  "./file-routing": {
    "types": "./src/file-routing.d.ts",
    "import": "./src/file-routing.js"
  },
  "./forms": {
    "types": "./src/forms.d.ts",
    "import": "./src/forms.js"
  }
}
```

The JSR string-export rule was not copied into `package.json`.

## CLI internals

CLI internals remain importable only from the internal source module for tests/implementation:

```txt
src/cli.js
```

They are not public root exports.

## Acceptance

- root API clean
- subpaths intact
- CLI internals not public root API
- npm conditional exports remain valid
