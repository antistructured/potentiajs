# File Routing CLI Check Mode Tests

## Files inspected

- `tests/file-routing-cli.test.js`
- `src/cli.js`
- `src/dev/file-routing/writer.js`
- `package.json`
- `src/index.js`
- `src/file-routing.js`

## Files changed

- `tests/file-routing-cli.test.js`
- `docs/internal/file-routing-cli-check-mode-tests.md`

## Tests added / updated

Updated:

```txt
tests/file-routing-cli.test.js
```

## Parser coverage

Added coverage for:

- valid `routes check`
- valid `routes check` with all flags
- rejecting `routes check --json`
- rejecting `routes check --watch`
- rejecting `routes check --config`
- rejecting `routes generate --check`
- updated usage text with `<generate|check>`

## Check behavior coverage

Added coverage for:

- check returns `1` when output is missing
- missing check does not create `.potentia/`
- missing check does not create `.potentia/routes.generated.js`
- check returns `0` when generated output is current
- check returns `1` when generated output is stale
- stale check does not rewrite stale output
- check returns `1` on route diagnostics failure
- check returns `2` on invalid usage
- check uses normalized newline comparison
- check respects `--cwd`
- check respects `--root`
- check respects `--out`
- check respects `--package`
- output messages include run hint for stale/missing
- `checkFileRoutes(...)` reports status without writing

## Package / API coverage

Existing package/API expectations were preserved and expanded:

- `bin.potentia` remains present
- root exports do not include CLI internals
- root exports do not include `generateFileRoutes`
- root exports do not include `checkFileRoutes`
- file-routing subpath still exposes only `generateFileRoutes`

## Focused test result

```bash
bun test tests/file-routing-cli.test.js
```

Result:

```txt
18 pass
0 fail
102 expect() calls
```

## Blockers

None.

## Publish status

No publish command was run.
