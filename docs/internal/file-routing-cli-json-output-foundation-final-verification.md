# File Routing CLI JSON Output Foundation Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

A packed installed-artifact JSON smoke was also run.

No publish commands were run.

## Results

### Tests

```txt
593 pass
0 fail
1383 expect() calls
```

### Release check

```txt
593 pass
0 fail
1383 expect() calls
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

### Packed JSON smoke

Installed local tarball in a fresh temp project and verified:

- `routes check --json` before generation exits `1`, emits valid JSON status `missing`, and creates no output
- `routes generate --json` exits `0`, emits valid JSON status `generated`, and writes output
- `routes check --json` after generation exits `0` and emits valid JSON status `current`
- stale generated output followed by `routes check --json` exits `1`, emits valid JSON status `stale`, and does not rewrite output
- stderr is empty for JSON command-result envelopes
- temp project and pack directory were cleaned up

## Implementation summary

Implemented:

```bash
potentia routes generate --json
potentia routes check --json
```

Supported flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
--json
```

JSON statuses:

```txt
generated
current
missing
stale
failed
invalid-usage
```

JSON command results go to stdout.

Exit codes remain unchanged:

```txt
0 = generated/current success
1 = failed/missing/stale/generation or IO error
2 = invalid usage/options
```

## Files created / updated

Implementation:

- `src/cli.js`

Tests:

- `tests/file-routing-cli.test.js`

Public docs:

- `README.md`
- `examples/file-routing-basic/README.md`

Internal docs:

- `docs/internal/file-routing-cli-json-output-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-json-parser-support.md`
- `docs/internal/file-routing-cli-json-envelope-helper.md`
- `docs/internal/file-routing-cli-generate-json-output.md`
- `docs/internal/file-routing-cli-check-json-output.md`
- `docs/internal/file-routing-cli-json-output-tests.md`
- `docs/internal/file-routing-cli-json-docs-update.md`
- `docs/internal/file-routing-cli-json-package-smoke.md`
- `docs/internal/file-routing-cli-json-output-foundation-final-verification.md`

## Invariants verified

- package name unchanged: `@potentiajs/core`
- version unchanged: `0.1.0-preview.0`
- bin remains `potentia -> ./bin/potentia.js`
- root exports unchanged
- file-routing subpath unchanged and still exports only `generateFileRoutes`
- `routes generate --json` works
- `routes check --json` works
- JSON output goes to stdout
- text-mode output behavior remains unchanged
- exit codes remain unchanged
- `generate --json` still writes files
- `check --json` still does not write files
- invalid usage JSON works when possible
- no watch/config/compiler/dev server added
- no package metadata changes for this block
- no real publish

## Remaining blockers

None for this JSON output foundation block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next block:

```txt
Form HTML Rendering Design Gate
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

Alternative if continuing file routing:

```txt
File Routing Watch Mode Design Gate
```

## Publish status

Real publish was not run.
