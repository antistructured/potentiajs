# File Routing CLI Check Mode Foundation Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `bin/potentia.js`
- `src/cli.js`
- `src/dev/file-routing/`
- `src/dev/file-routing/writer.js`
- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/scanner.js`
- `src/file-routing.js`
- `examples/file-routing-basic/`
- `examples/file-routing-basic/README.md`
- `tests/file-routing-cli.test.js`
- `docs/internal/file-routing-cli-check-mode-design-report.md`
- `docs/internal/file-routing-cli-check-command-shape-decision.md`
- `docs/internal/file-routing-cli-check-stale-detection-decision.md`
- `docs/internal/file-routing-cli-check-output-exit-decision.md`
- `docs/internal/file-routing-cli-check-json-output-decision.md`

## Scope

This block implements exactly one new CLI command:

```bash
potentia routes check
```

The command verifies generated file routes are current without writing output.

Supported flags match `routes generate`:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Defaults match `routes generate`:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

## Non-mutating requirement

`routes check` must:

1. scan the route tree
2. generate expected source in memory
3. read the existing generated output
4. normalize newlines
5. compare expected/current output
6. report current, missing, stale, or failed

`routes check` must not:

- write `.potentia/routes.generated.js`
- create `.potentia/`
- delete output
- rewrite stale output
- execute route modules
- start a watcher/server/compiler
- scan the filesystem during request handling

## Output / exit behavior

Expected statuses:

```txt
current -> exit 0 -> stdout
missing -> exit 1 -> stderr
stale -> exit 1 -> stderr
failed -> exit 1 -> stderr
invalid usage -> exit 2 -> stderr
```

## Deferred features

Do not implement in this block:

- `potentia routes generate --check`
- `--json`
- `routes watch`
- `--config`
- config files
- route manifest output
- compiler/dev server
- route convention expansion
- release/publish fixes
- real publish

## Export boundaries

The package root must not export CLI internals.

The `@potentiajs/core/file-routing` subpath must remain unchanged and continue to export only `generateFileRoutes`.

Internal helpers may be added for source generation/checking, but they must not become public package root exports.

## Blockers

None.

## Publish status

No publish command was run.
