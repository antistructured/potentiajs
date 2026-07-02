# API Pruning Export Smoke

## Files inspected

- `src/index.js`
- `tests/root-export-surface.test.js`
- `package.json`
- `npm pack --dry-run --json` output
- packed artifact install smoke output

## Files changed

- `tests/root-export-surface.test.js`
- `docs/internal/api-pruning-export-smoke.md`

## Tests added

Added `tests/root-export-surface.test.js`.

The test verifies:

- expected preview core exports exist
- expected preview advanced exports exist
- expected preview projection exports exist
- expected preview diagnostic exports exist
- root export set has exactly 24 symbols
- removed internal candidates are absent:
  - `createRequestContext`
  - `runEffect`
  - `normalizeFrameworkError`
  - `toResponse`

## Verification run

Commands run:

- `bun run test`
- `bun test`
- `bun run check`
- `bun run check:file-routing`
- `bun run check:preview`
- `npm pack --dry-run --json`
- packed artifact install smoke with `bun add <tarball>`

Results:

- tests: `557 pass`, `0 fail`, `1173 expect() calls`
- bun test: `557 pass`, `0 fail`, `1173 expect() calls`
- check: `557 pass`, `0 fail`, `1173 expect() calls`
- file-routing tests: `35 pass`, `0 fail`, `112 expect() calls`
- preview check: `557 pass`, `0 fail`, `1173 expect() calls`
- pack dry-run: pass

## Pack result

- entry count: `37`
- `docs/internal/` excluded
- `tests/` excluded
- `.potentia/` excluded

## Packed artifact smoke

Packed artifact install smoke was rerun because root exports changed.

Observed output:

```json
{"exports":24,"status":200,"input":{"name":"Ada"},"formField":"name"}
```

The smoke verified installed package root exports, absence of removed internal candidates, action input, app routing, JSON response, SigilJS dependency resolution, and `projectForm(...)`.

## Blockers

No blocker. Export smoke, package verification, and packed artifact smoke all pass after pruning.
