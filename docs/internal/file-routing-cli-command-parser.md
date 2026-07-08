# File Routing CLI Command Parser

## Files inspected

- `src/cli.js`
- `docs/internal/file-routing-cli-options-defaults-decision.md`
- `docs/internal/file-routing-cli-diagnostics-output-decision.md`

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-command-parser.md`

## Parser behavior

Implemented internal parser:

```js
parseArgs(args)
```

Supported command:

```bash
potentia routes generate
```

Supported flags:

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
cwd: process cwd from CLI runtime unless --cwd is provided
```

## Invalid usage

Invalid usage returns parser result:

```js
{ ok: false, error, usage }
```

`main(...)` prints usage to stderr and returns exit code `2`.

Invalid examples covered by parser behavior:

- missing command
- unknown namespace
- unknown routes command
- unknown flag
- missing flag value
- unexpected positional argument

## Boundaries

Parser does not implement:

- `--json`
- `--check`
- `--watch`
- config loading
- dev server
- build/compiler commands

## Dependencies

No parser dependency was added.

## Export status

`parseArgs(...)` and `main(...)` are internal module exports from `src/cli.js` for tests/bin usage only. They are not package root exports.

## Blockers

None.

## Publish status

No publish command was run.
