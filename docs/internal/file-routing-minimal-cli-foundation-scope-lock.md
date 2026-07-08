# File Routing Minimal CLI Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/file-routing.js`
- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/`
- `examples/file-routing-basic/`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-design-gate-report.md`
- `docs/internal/file-routing-cli-name-command-decision.md`
- `docs/internal/file-routing-cli-options-defaults-decision.md`
- `docs/internal/file-routing-cli-diagnostics-output-decision.md`
- `docs/internal/file-routing-cli-config-watch-decision.md`

## Scope

This block implements exactly one CLI command:

```bash
potentia routes generate
```

The command is a thin dev-time wrapper around the existing public API:

```js
generateFileRoutes({
  rootDir,
  outputFile,
  packageName,
  cwd
});
```

## Flags implemented in this block

Implement only:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Defaults:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

## Output / exit behavior

Implement:

```txt
0 = successful generation
1 = generation / diagnostic / IO failure
2 = invalid usage / options
```

Success output goes to stdout.

Failure and usage output go to stderr.

Stack traces are hidden by default.

## Implementation boundaries

Allowed implementation files:

- `bin/potentia.js`
- `src/cli.js`
- `package.json`
- focused CLI tests
- README/example docs updates after implementation works

## Forbidden in this block

Do not implement:

- `--json`
- `--check`
- `--watch`
- `--config`
- `--manifest`
- `--clean`
- `--verbose`
- `--silent`
- config file loading
- watch mode
- compiler integration
- dev server
- app runner
- project generator
- new route conventions
- route manifest output
- frontend/form/client/OpenAPI generation
- release or registry recovery
- real publish

## Export boundaries

The CLI may be internally testable through `src/cli.js`, but it must not be exported from the package root.

Root exports must remain unchanged.

The `@potentiajs/core/file-routing` subpath must remain unchanged.

## Current package state

Current package has no `bin` field. Pass 2 will add:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

## Release status

Release/registry blockers remain parked:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

This block does not fix those.

## Publish status

No publish command was run.
