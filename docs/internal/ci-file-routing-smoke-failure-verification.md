# CI File Routing Smoke Failure Verification

## Commands run

```bash
bun test tests/file-routing-dev-example.test.js
bun test tests/file-routing-generated-smoke.test.js
bun run test
bun run check:preview
bun run check:release
npm pack --dry-run --json
```

No publish command was run.

## Targeted file-routing tests

```txt
file routing dev workflow example: 1 pass, 0 fail, 7 expect() calls
file routing generated smoke: 1 pass, 0 fail, 12 expect() calls
```

## Full local checks

```txt
bun run test: 609 pass, 0 fail, 1487 expect() calls
bun run check:preview: 609 pass, 0 fail, 1487 expect() calls
bun run check:release: 609 pass, 0 fail, 1487 expect() calls
```

## Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
```

Pack assertions:

- generated `.potentia/` output included: no
- `docs/internal/` included: no

## Active stale identity search

Post-patch active search found zero matches for:

- `from 'potentiajs'`
- `from "potentiajs"`
- `packageName: 'potentiajs'`
- `packageName: "potentiajs"`
- `@potentia/core`
- `@weipertda/potentiajs`
- `poteniajs`

Search scope:

- `tests/`
- `examples/`
- `scripts/`
- `.github/workflows/`
- `src/dev/file-routing/`

## Acceptance status

- both failing historical file-routing tests pass locally
- active stale package identity references are absent
- generated smoke expects `@potentiajs/core`
- dev workflow example uses current subpath API for generation
- local test/check/pack pass
- no publish command run

## Blockers

None for local CI file-routing smoke verification.
