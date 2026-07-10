# 0.1.0 Release Prep Report

## Outcome

PotentiaJS is prepared for its first serious public ZeroVer release:

```txt
@potentiajs/core@0.1.0
```

No manual publish was run.

## Pass 1 — 0.1.0 Scope Lock

Created:

- `docs/internal/010-release-scope-lock.md`

Result:

- locked `0.1.0` to first public ZeroVer foundation
- no feature creep
- no source/API churn unless a real blocker appears
- preserved no-JSX law and server-first/HTML-first identity

## Pass 2 — Public API Freeze Review

Created:

- `docs/internal/010-public-api-freeze-review.md`

Root exports inventoried:

- `action`
- `call`
- `composeRoutes`
- `context`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRouteManifest`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `ok`
- `projectAction`
- `projectContract`
- `projectForm`
- `projectRoute`
- `projectRoutes`
- `redirect`
- `route`
- `text`
- `value`

Subpath exports:

- `@potentiajs/core/file-routing`: `generateFileRoutes`
- `@potentiajs/core/forms`: `renderForm`

Confirmed private from root:

- `generateFileRoutes`
- `renderForm`
- CLI internals
- dev internals

No API changes were needed.

## Pass 3 — Package Metadata Final Review

Created:

- `docs/internal/010-package-metadata-final-review.md`

Reviewed:

- npm package metadata
- JSR package metadata
- exports
- files allowlist
- keywords
- dependency posture
- binary posture
- JSR lean artifact posture

Decisions:

- description is acceptable
- keywords are appropriate
- final npm publish should intentionally set `latest -> 0.1.0`
- examples intentionally ship to npm
- JSR intentionally stays leaner than npm
- CLI is intentionally npm-only for now
- static `publishConfig.tag: preview` should be removed before final

## Pass 4 — README Final Release Review

Created:

- `docs/internal/010-readme-final-release-review.md`

Changed:

- README version/posture from preview to `0.1.0`
- install docs to final npm/Bun install shape
- ZeroVer caveat clarified
- server-first/HTML-first/no-JSX posture clarified
- packageVersion example updated to `0.1.0`
- release status updated for final prep
- forms subpath added to public subpath status

## Pass 5 — CHANGELOG 0.1.0 Draft

Created:

- `docs/internal/010-changelog-draft.md`

Changed:

- added `## 0.1.0`
- preserved preview history
- avoided production/API permanence overclaims

## Pass 6 — npm / JSR Publish Posture Review

Created:

- `docs/internal/010-publish-posture-review.md`

Changed:

- `.github/workflows/publish.yml`
- `package.json`

Workflow now computes npm tag from package version:

```bash
if [[ "$VERSION" == *"-preview."* ]]; then
  TAG="preview"
else
  TAG="latest"
fi
```

Publish command now uses computed tag:

```bash
npm publish --access public --tag "$TAG" --provenance=false
```

Verification now checks the computed tag:

```bash
npm view "$NAME@$TAG" version --registry=https://registry.npmjs.org
```

Removed static `publishConfig.tag: preview` from `package.json`.

## Pass 7 — Fresh Consumer Smoke Script

Created:

- `docs/internal/010-fresh-consumer-smoke-check.md`

Approach:

- documented checklist rather than committed script

Coverage:

- fresh install
- root import
- file-routing import
- forms import
- CLI binary
- routes check/generate/check
- generated routes app usage
- root export cleanliness

## Pass 8 — Version Bump Prep

Created:

- `docs/internal/010-version-bump-prep.md`

Changed:

- `package.json`: `0.1.0-preview.1 -> 0.1.0`
- `jsr.json`: `0.1.0-preview.1 -> 0.1.0`

Verified versions match:

```txt
0.1.0
```

## Pass 9 — Full Release Gate

Created:

- `docs/internal/010-full-release-gate.md`

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
- npm pack: pass, `@potentiajs/core@0.1.0`, `56` entries
- JSR dry-run: pass, `36` entries
- version consistency: `0.1.0`

## Version

- previous: `0.1.0-preview.1`
- current: `0.1.0`

## Public API

- root: application kernel, routes, actions, projections, effects, results/responses, form state
- file-routing: `generateFileRoutes`
- forms: `renderForm`
- CLI: `potentia routes generate`, `potentia routes check`

## Release posture

- npm final tag: `latest`
- npm preview tag: `preview`
- JSR: lean artifact with root/file-routing/forms exports
- ZeroVer warning: present
- no JSX law: present

## Tests

- bun test: pass
- check:release: pass
- npm pack: pass
- JSR dry-run: pass

## Files changed

- `.github/workflows/publish.yml`
- `CHANGELOG.md`
- `README.md`
- `jsr.json`
- `package.json`
- `docs/internal/010-*.md`

## Publish status

- npm publish: not run manually
- JSR publish: not run manually
- dist-tag mutation: not run manually

## Remaining blockers

None for release prep.

Human approval is still required before running the publish workflow.

## Recommendation

Commit and run the publish workflow for `0.1.0`.

After the publish workflow passes, run a shortened post-publish registry verification for:

- npm `latest -> 0.1.0`
- JSR `0.1.0`
- fresh npm install
- root/file-routing/forms imports
- CLI generate/check smoke
- generated routes app smoke
