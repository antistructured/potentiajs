# File Routing Minimal CLI Tests

## Files inspected

- `src/cli.js`
- `bin/potentia.js`
- `package.json`
- `src/index.js`
- `src/file-routing.js`

## Files changed

- `tests/file-routing-cli.test.js`
- `docs/internal/file-routing-minimal-cli-tests.md`

## Tests added

Created:

```txt
tests/file-routing-cli.test.js
```

Coverage:

### Parser

- valid default command
- valid command with all flags
- invalid missing command
- invalid incomplete command
- invalid unknown route command
- invalid unknown flag
- invalid missing flag value
- invalid unsupported command such as `dev` / `build`
- invalid extra positional argument

### Command behavior

- successful generation
- success output to stdout
- failure output to stderr
- exit code `0` on success
- exit code `1` on generation failure
- exit code `2` on invalid usage
- `--cwd` behavior
- `--root` behavior
- `--out` behavior
- default package import `@potentiajs/core`
- package override behavior
- generated header
- no runtime filesystem import in generated output
- no stack trace in diagnostics output

### Package expectations

- `package.json` has `bin.potentia`
- `bin/potentia.js` exists
- root exports do not include CLI internals
- root exports do not include `generateFileRoutes`
- file-routing subpath still exposes only `generateFileRoutes`

## Focused test result

```bash
bun test tests/file-routing-cli.test.js
```

Result:

```txt
8 pass
0 fail
50 expect() calls
```

## Blockers

None.

## Publish status

No publish command was run.
