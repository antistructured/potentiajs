# File Routing CLI Check Mode Foundation Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

A packed installed-artifact check smoke was also run.

No publish commands were run.

## Results

### Tests

```txt
583 pass
0 fail
1323 expect() calls
```

### Release check

```txt
583 pass
0 fail
1323 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 57
bin/potentia.js: included
src/cli.js: included
docs/internal/: excluded
```

### Packed check smoke

Installed local tarball in a fresh temp project and verified:

- missing check exits `1`
- missing check does not create `.potentia/`
- generate exits `0`
- current check exits `0`
- stale check exits `1`
- stale check does not rewrite stale output
- generated routes still import and serve correctly through `createApp(...)`

Missing stderr:

```txt
File routes are not generated:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Current stdout:

```txt
File routes are current:
- root: routes
- output: .potentia/routes.generated.js
- routes: 2
- scopes: 0
```

Stale stderr:

```txt
File routes are stale:
- output: .potentia/routes.generated.js
- run: potentia routes generate
```

Route smoke:

```json
{"rootStatus":200,"rootBody":"home","userStatus":200,"userBody":{"id":"ada"},"generatedHasHeader":true,"generatedHasPackageImport":true,"generatedHasRuntimeFs":false,"binExists":true}
```

## Implementation summary

Implemented:

```bash
potentia routes check
```

Supported flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Same defaults as generate:

```txt
root: routes
out: .potentia/routes.generated.js
package: @potentiajs/core
cwd: process.cwd()
```

Check behavior:

```txt
current -> exit 0 -> stdout
missing -> exit 1 -> stderr
stale -> exit 1 -> stderr
failed -> exit 1 -> stderr
invalid usage -> exit 2 -> stderr
```

Comparison:

```txt
normalized newline comparison
```

## Files created / updated

Implementation:

- `src/cli.js`
- `src/dev/file-routing/writer.js`

Tests:

- `tests/file-routing-cli.test.js`

Public docs:

- `README.md`
- `examples/file-routing-basic/README.md`

Internal docs:

- `docs/internal/file-routing-cli-check-mode-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-check-parser-support.md`
- `docs/internal/file-routing-cli-check-core.md`
- `docs/internal/file-routing-cli-check-output-exit.md`
- `docs/internal/file-routing-cli-check-mode-tests.md`
- `docs/internal/file-routing-cli-check-docs-update.md`
- `docs/internal/file-routing-cli-check-package-smoke.md`
- `docs/internal/file-routing-cli-check-mode-foundation-final-verification.md`

## Invariants verified

- package name unchanged: `@potentiajs/core`
- version unchanged: `0.1.0-preview.0`
- bin remains `potentia -> ./bin/potentia.js`
- root exports unchanged
- file-routing subpath unchanged and still exports only `generateFileRoutes`
- `routes check` added
- `generate --check` not added
- JSON output not added
- watch/config/compiler/dev server not added
- no new dependencies added
- check mode does not write missing output
- check mode does not rewrite stale output
- README accurate
- example docs accurate
- release blockers remain parked

## Remaining blockers

None for this check mode foundation block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next file-routing block:

```txt
File Routing CLI JSON Output Design Gate
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

## Publish status

Real publish was not run.
