# Registry Hygiene Implementation Report

## Outcome

Decision:

```txt
C — Version bump to 0.1.0-preview.1 is prepared and publish workflow is ready to run after human approval.
```

No manual publish was run.

## Pass 1 — Implementation Scope Lock

Created:

- `docs/internal/registry-hygiene-implementation-scope-lock.md`

Result:

- scoped implementation to registry hygiene only
- confirmed no source/API behavior work
- confirmed untracked post-publish/planning docs are intentional audit trail inputs
- confirmed no publish or dist-tag mutation in this block

## Pass 2 — JSR Schema Verification

Created:

- `docs/internal/registry-hygiene-jsr-schema-verification.md`

Commands run:

- `npx jsr --help`
- `npx jsr publish --help`
- `npx jsr publish --dry-run --allow-dirty`
- temporary local schema probes with restored `jsr.json`

Findings:

- top-level `include` / `exclude` did not constrain the artifact as intended
- `publish.include` / `publish.exclude` did constrain the artifact
- glob patterns such as `src/**/*.js` and `src/**/*.d.ts` work
- JSR includes `jsr.json` automatically
- exported files must be included for dry-run validation to pass

## Pass 3 — JSR Include/Exclude Patch

Changed:

- `jsr.json`
- `docs/internal/registry-hygiene-jsr-include-exclude-patch.md`

JSR include:

```json
[
  "src/**/*.js",
  "src/**/*.d.ts",
  "README.md",
  "LICENSE",
  "package.json"
]
```

JSR exclude:

```json
[
  ".github",
  "docs",
  "tests",
  "examples",
  "plugins",
  "scripts",
  "cli",
  ".potentia",
  "bun.lock",
  "*.mjs",
  "*.view"
]
```

Exports preserved:

- `.`
- `./file-routing`
- `./forms`

## Pass 4 — JSR Artifact Dry Run

Created:

- `docs/internal/registry-hygiene-jsr-artifact-dry-run.md`

Command:

```bash
npx jsr publish --dry-run --allow-dirty
```

Result:

```txt
Success: dry run complete
artifact entries: 36
```

Before:

```txt
90 manifest entries
```

After:

```txt
36 dry-run entries
```

Excluded from JSR dry-run:

- `.github/`
- `docs/`
- `tests/`
- `examples/`
- `plugins/`
- `scripts/`
- `cli/`
- `.potentia/`
- `bun.lock`
- root exploratory `.mjs` files
- `*.view` files

## Pass 5 — npm Dist-Tag Workflow Verification Patch

Changed:

- `.github/workflows/publish.yml`
- `docs/internal/registry-hygiene-npm-dist-tag-workflow-patch.md`

Workflow behavior:

- preview publish still uses `npm publish --access public --tag preview --provenance=false`
- added post-publish verification for:
  - `npm view "$NAME" dist-tags --json`
  - `npm view "$NAME@preview" version`
- workflow fails if `preview` does not match `package.json` version
- workflow prints `latest` informationally
- workflow does not fail solely because current `latest` points to preview
- no dist-tag mutation is added

## Pass 6 — Internal Docs Audit Trail Commit Prep

Created:

- `docs/internal/registry-hygiene-internal-docs-audit-trail.md`

Confirmed:

- post-publish verification docs exist
- registry hygiene planning docs exist
- implementation docs exist
- `npm pack --dry-run --json` excludes:
  - `docs/internal/`
  - `tests/`
  - generated `.potentia/`

## Pass 7 — Version / Changelog Decision

Changed:

- `package.json`
- `jsr.json`
- `CHANGELOG.md`
- `README.md`
- `docs/internal/registry-hygiene-version-changelog-decision.md`

Decision:

```txt
0.1.0-preview.0 -> 0.1.0-preview.1
```

Rationale:

- artifact config changed materially
- external JSR artifact correction requires a new published version to verify
- preview.1 is a small registry hygiene rehearsal before final `0.1.0`

## Pass 8 — Full Release Verification

Created:

- `docs/internal/registry-hygiene-full-release-verification.md`

Commands run:

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Results:

- `bun run test`: `609 pass`, `0 fail`, `1487 expect() calls`
- `bun run check:release`: `609 pass`, `0 fail`, `1487 expect() calls`
- npm pack: pass, `56` entries, version `0.1.0-preview.1`
- JSR dry-run: pass, `36` entries
- version consistency: `0.1.0-preview.1`

## Files changed

- `.github/workflows/publish.yml`
- `CHANGELOG.md`
- `README.md`
- `jsr.json`
- `package.json`
- `docs/internal/post-publish-*.md`
- `docs/internal/registry-hygiene-*.md`

## Version

- previous: `0.1.0-preview.0`
- current: `0.1.0-preview.1`
- bump applied: yes

## JSR artifact

- before: `90` manifest entries in published preview.0 metadata
- after: `36` entries in local preview.1 dry-run
- excluded: repo-only workflows, docs, tests, examples, plugins, scripts, cli folder, `.potentia`, lockfile, exploratory root `.mjs`, `.view` files
- exports preserved: `.`, `./file-routing`, `./forms`

## npm workflow

- preview publish tag: `--tag preview`
- post-publish verification: verifies `@preview` resolves to `package.json` version
- latest handling: informational only during preview era, no failure if `latest == preview`

## Tests

- bun test: pass
- check:release: pass
- npm pack: pass
- jsr dry-run: pass

## Publish status

- npm publish: not run manually
- JSR publish: not run manually
- dist-tag mutation: not run

## Remaining blockers

None for implementation readiness.

Human approval is still required before running the publish workflow.

## Recommendation

Run the publish workflow for `0.1.0-preview.1`, then run Post-Publish Registry Verification again in shortened form.
