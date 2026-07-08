# File Routing CLI Design Gate Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified:

- no package `bin`
- no root export change
- file-routing subpath unchanged
- README still says there is no public CLI yet
- README does not claim `potentia routes generate` exists

No publish commands were run.

## Results

### Tests

```txt
565 pass
0 fail
1221 expect() calls
```

### Release check

```txt
565 pass
0 fail
1221 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 55
bin files included: no
examples/file-routing-basic/: included
docs/internal/: excluded
```

## Design docs created

- `docs/internal/file-routing-cli-design-scope-lock.md`
- `docs/internal/file-routing-cli-name-command-decision.md`
- `docs/internal/file-routing-cli-options-defaults-decision.md`
- `docs/internal/file-routing-cli-diagnostics-output-decision.md`
- `docs/internal/file-routing-cli-config-watch-decision.md`
- `docs/internal/file-routing-cli-docs-example-decision.md`
- `docs/internal/file-routing-cli-design-gate-report.md`
- `docs/internal/file-routing-cli-design-gate-final-verification.md`

## Invariants verified

- no source implementation added
- no package `bin` added
- no root exports changed
- no subpath exports changed
- no CLI docs claiming implementation in README
- no watch/config implementation
- no release/publish changes
- no route convention changes

## Final CLI decision

```txt
binary: potentia
first command: potentia routes generate
initial flags: --root <dir>, --out <file>, --package <specifier>, --cwd <dir>
deferred: --json, --check, --watch, --config, --manifest, --clean, --verbose, --silent
config: no config file initially
watch: deferred
recommendation: A — Implement Minimal CLI Foundation
```

## Remaining blockers

None for the CLI design gate.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Publish status

Real publish was not run.
