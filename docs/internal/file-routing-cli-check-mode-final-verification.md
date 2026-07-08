# File Routing CLI Check Mode Design Gate Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified:

- package name unchanged
- version unchanged
- package bin unchanged
- root exports unchanged
- file-routing subpath unchanged
- `routes check` not implemented
- README does not claim check mode exists
- example README does not claim check mode exists
- all design docs exist

No publish commands were run.

## Results

### Tests

```txt
573 pass
0 fail
1271 expect() calls
```

### Release check

```txt
573 pass
0 fail
1271 expect() calls
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

## Design docs created

- `docs/internal/file-routing-cli-check-mode-scope-lock.md`
- `docs/internal/file-routing-cli-check-command-shape-decision.md`
- `docs/internal/file-routing-cli-check-stale-detection-decision.md`
- `docs/internal/file-routing-cli-check-output-exit-decision.md`
- `docs/internal/file-routing-cli-check-json-output-decision.md`
- `docs/internal/file-routing-cli-check-docs-example-decision.md`
- `docs/internal/file-routing-cli-check-mode-design-report.md`

## Final design decision

Canonical command:

```bash
potentia routes check
```

Alias posture:

```txt
potentia routes generate --check = future alias, not first implementation
```

Flags/defaults match `routes generate`:

```txt
--root <dir>       default routes
--out <file>      default .potentia/routes.generated.js
--package <spec>  default @potentiajs/core
--cwd <dir>       default process.cwd()
```

Comparison:

```txt
normalized newline comparison
```

Exit codes:

```txt
0 = output exists and is current
1 = output missing, stale, or generation diagnostics failed
2 = invalid CLI usage/options
```

JSON:

```txt
design now, defer implementation
```

## Invariants verified

- no source implementation added for check mode
- no package metadata changes for this design block
- no root export changes
- no file-routing subpath changes
- no public README check-mode claim
- no public example check-mode claim
- no watch/config/compiler/dev server added
- no release/publish changes

## Remaining blockers

None for this design gate.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next file-routing block:

```txt
File Routing CLI Check Mode Foundation
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

## Publish status

Real publish was not run.
