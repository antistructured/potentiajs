# Owner Publish Decision Checklist Report

## 1. Current package

- Current package name: `potentia-js`
- Intended npm package name: `potentiajs`
- Fallback npm package name: `@weipertda/potentiajs`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Dev dependencies: none
- Root exports: 24 intentional experimental exports

## 2. Current version

- Current: `0.0.1`
- Recommended preview target: `0.1.0-preview.0`
- Conservative fallback: `0.0.2-preview.0`

Version rationale: use SemVer to communicate package/API maturity, not commit count. The repo currently has 3 commits, but commit count should not determine the npm version.

## 3. Current private/public state

- Current `private`: `true`
- Intended visibility: public npm preview
- `publishConfig`: absent
- desired publish method: CI publish, preferably protected/manual-trigger CI release workflow
- real npm publish: not run
- npm publish dry-run: skipped while package remains private

## 4. Current license state

- Current package license metadata: `UNLICENSED`
- Intended license: `MIT`
- root `LICENSE`: absent

MIT is the implementation default unless a later owner instruction chooses another free/open license.

## 5. Current repository metadata

Current package metadata still points to the old/incorrect remote-derived path:

- `repository.url`: `git+https://github.com/antistructured/poteniajs.git`
- `bugs.url`: `https://github.com/antistructured/poteniajs/issues`
- `homepage`: `https://github.com/antistructured/poteniajs#readme`

Owner decision:

- intended GitHub slug: `antistructured/potentiajs`

Final release prep should correct repository metadata after the repo/remote is confirmed or renamed externally.

## 6. Current npm readiness state

Mechanical readiness is good:

- release check exists: `bun run check:release`
- CI exists: `.github/workflows/ci.yaml`
- package dry-run passes
- packed artifact smoke passes
- package contents are clean

Remaining npm checks:

- check availability for `potentiajs`
- if unavailable, use `@weipertda/potentiajs`
- configure CI publish credentials/trusted publishing
- decide CI protection/manual approval details

## 7. Current JSR readiness state

Owner direction:

- JSR scope/name should mirror npm.
- Recommended JSR identity: `@weipertda/potentiajs`.

Decision status:

- JSR identity direction is decided.
- JSR implementation still needs a compatibility design gate if it ships with first preview.

Current blockers:

- no `jsr.json`
- no `deno.json`
- dependency compatibility unresolved
- docs/export policy unresolved
- final type declaration story not implemented

## 8. Current type declaration state

Current state:

- no TypeScript source
- no `.d.ts` files
- no generated declarations
- no JSDoc declaration pipeline
- no `types` metadata

Best option for PotentiaJS:

- handwrite minimal conservative root declarations before public npm/JSR preview
- keep source plain JavaScript ESM
- validate declarations with type smoke tests

## 9. Decisions still required

External/practical decisions still needed:

- confirm GitHub repo has been renamed/exists as `antistructured/potentiajs`
- check npm availability for `potentiajs`
- if needed, confirm npm scope/package fallback `@weipertda/potentiajs`
- configure npm trusted publishing/token/2FA posture for CI publish
- decide whether JSR ships with first preview or follows after npm
- decide whether to do Type Declaration Prep inside Final Public Preview Release Prep or as its own preceding block

## 10. Decisions already made

Owner decisions captured:

- license: MIT/free license; use MIT by default
- repository slug: `antistructured/potentiajs`
- npm package name: `potentiajs`
- fallback npm package name: `@weipertda/potentiajs`
- npm visibility: public
- publish method: CI publish desired
- version family: `0.x.x`
- recommended version: `0.1.0-preview.0`
- JSR identity: mirror npm as `@weipertda/potentiajs`
- type posture: best option is minimal handwritten declarations before public preview
- changelog posture: create root `CHANGELOG.md` in final release prep

Mechanical decisions already made in prior blocks:

- root API surface pruned to 24 intentional exports
- package contents are clean
- internal docs remain repo-only
- CI/release check exists
- no real publish has occurred

## 11. Exact package changes blocked until final release prep

Do in Final Public Preview Release Prep, not in this decision-capture update:

- add root `LICENSE`
- update `package.json` `license` to `MIT`
- update repository metadata to `antistructured/potentiajs`
- update package `name` to `potentiajs` or fallback `@weipertda/potentiajs`
- set `private: false`
- add `publishConfig.access` if needed/desired
- bump version to `0.1.0-preview.0` unless owner chooses fallback
- create root `CHANGELOG.md`
- update README install/import/status examples
- add minimal declarations and type metadata, if included in release prep
- add CI publish workflow or extend CI with protected/manual release publish
- run `npm publish --dry-run`

Still forbidden without explicit final publish instruction:

- real `npm publish`
- real `jsr publish`

## 12. Recommended decision set

Recommended final release prep target:

- License: `MIT`
- Repository: `https://github.com/antistructured/potentiajs`
- npm name: `potentiajs` if available, else `@weipertda/potentiajs`
- Visibility: public npm preview
- Version: `0.1.0-preview.0`
- Publish method: protected/manual-trigger CI publish
- JSR: `@weipertda/potentiajs`; run JSR Compatibility Design Gate first if shipping JSR in same preview
- Types: minimal conservative handwritten root declarations
- Changelog: root `CHANGELOG.md` in final release prep

## 13. Recommended next block

Recommendation: **A — Owner Decisions Sufficient; Proceed To Final Release Prep after external availability checks**.

Reason: the owner supplied enough product-direction decisions to plan final release prep. The remaining work is implementation plus external availability/credential checks, not product ambiguity.

Recommended next block:

**Final Public Preview Release Prep**

Include these steps:

1. Confirm/prepare repo metadata for `antistructured/potentiajs`.
2. Check npm availability for `potentiajs`; fall back to `@weipertda/potentiajs` if unavailable.
3. Apply MIT license and root `LICENSE`.
4. Rename package metadata/import docs to chosen package name.
5. Apply `0.1.0-preview.0` unless owner overrides.
6. Set public package posture.
7. Create root `CHANGELOG.md`.
8. Add minimal declarations or run a Type Declaration Prep subpass.
9. Add protected/manual-trigger CI publish workflow.
10. Run full checks, pack, packed artifact smoke, and `npm publish --dry-run`.
11. Do not run real publish unless explicitly instructed.

If JSR must ship in the same release, run **JSR Compatibility Design Gate** before or inside final release prep.
