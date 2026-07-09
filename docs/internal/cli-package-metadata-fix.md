# CLI Package Metadata Fix

## Files inspected

- `package.json`
- `bin/potentia.js`
- `src/cli.js`
- pack dry-run output

## Files changed

- `package.json`
- `src/cli.js`
- `docs/internal/cli-package-metadata-fix.md`

## Fixes

### `bin` contract

Verified/fixed package metadata to the intended contract:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

This restores the contract asserted by `tests/file-routing-cli.test.js`.

### Package allowlist

Current package allowlist includes broad package source and binary directories:

```json
"files": [
  "bin/",
  "src/",
  "examples/file-routing-basic/",
  "examples/full-flow-basic/",
  "examples/form-rendering-basic/",
  "README.md",
  "CHANGELOG.md",
  "LICENSE"
]
```

This ensures `bin/potentia.js` and `src/cli.js` are included together.

### CLI implementation rollback repaired

`src/cli.js` was restored to the current CLI implementation from `HEAD` after inspection showed the working tree had accidentally regressed to an older generate-only CLI.

The restored implementation includes the current internal test imports:

- `parseArgs`
- `main`
- `checkFileRoutes`
- `createJsonEnvelope`
- `toJsonDiagnostics`
- `USAGE`

These remain internal module exports for tests/CLI internals, not root API exports.

## Explicit exclusions preserved

The package allowlist does not include:

- `docs/internal/`
- `tests/`
- generated `.potentia/` output

## Acceptance

- package bin exists
- package files include `bin/`
- package files include `src/cli.js`
- no internal docs/generated output included
