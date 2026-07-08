# File Routing CLI Options / Defaults Decision

## Files inspected

- `scripts/generate-file-routes.js`
- `src/dev/file-routing/writer.js`
- `examples/file-routing-basic/generate.js`
- `docs/internal/file-routing-cli-name-command-decision.md`

## Initial command

```bash
potentia routes generate
```

Equivalent explicit command:

```bash
potentia routes generate --root routes --out .potentia/routes.generated.js --package @potentiajs/core
```

## Defaults

Initial defaults:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

These map directly to:

```js
generateFileRoutes({
  rootDir: root,
  outputFile: out,
  packageName: package,
  cwd
});
```

## Initial flags

Include in first implementation:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

### `--root <dir>`

Route tree root. Default:

```txt
routes
```

### `--out <file>`

Generated module output. Default:

```txt
.potentia/routes.generated.js
```

### `--package <specifier>`

Package import specifier used by generated output. Default:

```txt
@potentiajs/core
```

Reason to expose: monorepo/self-import tests, forks, and deliberate package aliases.

### `--cwd <dir>`

Base directory for resolving relative `--root` and `--out`. Default:

```txt
process.cwd()
```

Reason to expose: scripts and monorepo calls can target a project without changing shell directory.

## Deferred flags

Defer from first implementation:

```txt
--json
--check
--watch
--config
--manifest
--clean
--verbose
--silent
```

## `--json` decision

Deferred.

Reason:

- the baseline CLI should first settle human output
- JSON output should match `generateFileRoutes(...)` result shape exactly
- machine-readable output becomes a compatibility surface

## `--check` decision

Deferred from first implementation.

Reason:

- check mode needs a precise stale-output comparison contract
- generated output includes deterministic text, but check semantics should decide whether to write temp files, compare source only, and handle missing output
- first CLI should focus on generation

Future possible behavior:

```bash
potentia routes generate --check
```

Exit behavior:

```txt
0 = generated output is current
1 = generated output is stale or generation would fail
2 = invalid CLI usage/options
```

## Invalid option behavior

Invalid or missing flag values should be CLI usage errors and exit with code `2`.

Examples:

```txt
--root requires a value
--out requires a value
--package requires a value
--cwd requires a value
unknown option: --watch
```

## Blockers

None. Initial option surface is intentionally small.

## Implementation status

No implementation was added.

No package metadata was changed.

## Publish status

No publish command was run.
