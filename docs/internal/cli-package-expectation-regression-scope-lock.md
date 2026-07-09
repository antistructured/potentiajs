# CLI Package Expectation Regression Scope Lock

## Files inspected

- `package.json`
- `bin/potentia.js`
- `src/cli.js`
- `src/index.js`
- `src/file-routing.js`
- `src/forms.js`
- `tests/file-routing-cli.test.js`

## Exact failing test

```txt
file routing CLI package expectations > package exposes potentia bin without root API pollution
```

Reported failure shape:

```txt
608 pass
1 fail
1481 expect() calls
Ran 609 tests across 85 files.
```

## Intended package contract

The package exposes the CLI through package metadata:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

The package should ship:

- `bin/potentia.js`
- `src/cli.js`

## Intended root export boundary

The root API must not export CLI or subpath internals:

- `generateFileRoutes`
- `renderForm`
- `main`
- `parseArgs`
- `checkFileRoutes`
- `createJsonEnvelope`
- `toJsonDiagnostics`

Correct public surfaces remain:

- `@potentiajs/core`
- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`
- `potentia` binary

## Scope

In scope:

- package metadata/package surface verification
- restoring accidental CLI internal regression if needed for package tests to import
- pack contents verification

Out of scope:

- feature work
- publish workflow changes
- real publish commands
- framework API expansion
- JSR export redesign

## Acceptance

Failure is scoped to package metadata/surface verification and source feature behavior is not expanded.
