# Public Preview Publish Prep Report

## 1. Current package

- Package: `potentia-js`
- Runtime: Bun-first plain JavaScript ESM
- Entrypoint: `./src/index.js`
- Runtime dependency: `@weipertda/sigiljs@0.18.0`
- Dev dependencies: none
- Root exports: 24

## 2. Version target

Current package version remains:

- `0.0.1`

Draft future preview target remains:

- `0.0.2-preview.0`

The preview version was not applied because license/public publish decisions remain unconfirmed.

## 3. License status

- Current metadata: `UNLICENSED`
- Root `LICENSE`: absent
- Decision: blocked on owner license choice

No license was guessed or added.

## 4. Repository metadata status

Repository metadata is now set from the actual Git remote:

- `repository.url`: `git+https://github.com/antistructured/poteniajs.git`
- `bugs.url`: `https://github.com/antistructured/poteniajs/issues`
- `homepage`: `https://github.com/antistructured/poteniajs#readme`

## 5. Private / publishConfig status

- `private`: `true`
- `publishConfig`: absent

Decision: keep private and do not add `publishConfig.access` until owner confirms public npm publish intent and license.

## 6. CI / release-check status

Release check script exists:

```bash
bun run check:release
```

Current implementation:

```json
"check:release": "bun run check:preview"
```

CI workflow exists:

- `.github/workflows/ci.yaml`

CI runs:

- checkout
- setup Bun
- `bun install --frozen-lockfile`
- `bun run check:release`
- `npm pack --dry-run --json`

CI contains no publish action and no secrets.

## 7. Changelog / release notes status

Created internal release notes and changelog prep:

- `docs/internal/public-preview-release-notes.md`
- `docs/internal/public-preview-changelog-prep.md`

Root `CHANGELOG.md` was deferred until final license/version/public publish decisions are confirmed.

## 8. npm readiness

Safe npm readiness checks pass:

- `bun run check:release`: pass
- `npm pack --dry-run --json`: pass
- packed artifact install smoke: pass

`npm publish --dry-run` was skipped because package remains private and license/public publish intent is blocked.

## 9. JSR readiness

Decision: **JSR design needed**.

Reasons:

- no `jsr.json`
- no `deno.json`
- no JSR scope/name decision
- no JSR docs/export policy
- no TypeScript declaration/type story
- dependency compatibility expectations need separate validation

## 10. Packed artifact smoke status

Packed artifact smoke passes.

Observed output:

```json
{"exports":24,"status":200,"input":{"name":"Ada"},"formField":"name"}
```

## 11. Remaining blockers

- license choice
- root `LICENSE` file
- package remains `private: true`
- no `publishConfig.access`
- npm access/2FA/package availability unconfirmed
- final preview version not applied
- root `CHANGELOG.md` deferred
- JSR scope/name/metadata unresolved
- TypeScript declarations/type story unresolved
- `npm publish --dry-run` skipped until package is intentionally publishable
- all APIs remain experimental

## 12. Exact commands run

```bash
git rev-parse --is-inside-work-tree
git remote -v
git status --short
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination "$TMP" --json
bun add <packed tarball>
bun smoke.mjs
```

Final verification also runs the full checks again.

## 13. Exact commands not run

```bash
npm publish
npm publish --dry-run
jsr publish
```

No real publish occurred.

## 14. Final recommendation

Recommendation: **B — Blocked On Owner Decisions**.

Reason: mechanical release prep is now in place and safe checks pass, but final public preview publishing still requires owner decisions for license, package visibility, npm access/package availability, final version, and JSR posture.

Next block should be **Owner Publish Decision Checklist** to collect:

- license
- repo URL confirmation if the current remote typo/path is intentional
- npm package visibility
- npm account/access/2FA/package availability
- final preview version
- JSR scope/name and whether to publish npm-only or npm + JSR
