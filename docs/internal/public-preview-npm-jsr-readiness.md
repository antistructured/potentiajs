# Public Preview npm / JSR Dry-Run Readiness

## Files inspected

- `package.json`
- `README.md`
- npm pack output at `/tmp/potentia-publish-prep-pack.json`
- `docs/internal/*jsr*` search
- `docs/internal/*npm*` search
- `jsr.json` search result: absent
- `deno.json` search result: absent

## Commands run

```bash
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination "$TMP" --json
bun add <packed tarball>
bun smoke.mjs
```

## Commands intentionally not run

```bash
npm publish
jsr publish
```

`npm publish --dry-run` was skipped because the package remains `private: true` and license/public publish intent is blocked. Running publish dry-run against a deliberately private/unlicensed public-preview candidate would create noisy/non-actionable failure rather than meaningful readiness signal.

## npm result

`bun run check:release`: pass.

Observed check summary:

- `557 pass`
- `0 fail`
- `1173 expect() calls`

`npm pack --dry-run --json`: pass.

Pack summary:

- package: `potentia-js`
- version: `0.0.1`
- entry count: `37`
- unpacked size: `101832`
- `docs/internal/` excluded
- `tests/` excluded
- `.github/` excluded

## Packed artifact release smoke

Packed artifact install smoke passes after metadata and release-check changes.

Observed output:

```json
{"exports":24,"status":200,"input":{"name":"Ada"},"formField":"name"}
```

## JSR decision

Decision: **JSR design needed**.

Reasons:

- no `jsr.json`
- no `deno.json`
- no JSR package scope/name decision
- no JSR docs/export policy
- no TypeScript declaration/type story
- dependency compatibility expectations need a separate check
- npm preview can proceed separately once owner decisions are resolved

## Blockers

- `npm publish --dry-run` remains blocked until package visibility/license/public publish intent are confirmed.
- JSR requires a dedicated design gate before any dual-publish attempt.
