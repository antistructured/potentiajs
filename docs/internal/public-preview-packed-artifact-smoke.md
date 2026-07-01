# Public Preview Packed Artifact Smoke

## Files inspected

- `package.json`
- packed artifact produced by `npm pack --pack-destination`
- temporary install project outside the package source

## Files changed

- `docs/internal/public-preview-packed-artifact-smoke.md`

## Package manager used

- `npm pack --pack-destination` for the local tarball
- `bun add <tarball>` for install into a fresh temporary project
- `bun smoke.mjs` for runtime verification

## Commands performed

1. Created temporary directory outside the source tree with `mktemp -d /tmp/potentia-packed-smoke-XXXXXX`.
2. Packed the project with `npm pack --pack-destination "$TMP" --json`.
3. Created a fresh temp project with `package.json` containing `{ "type": "module", "private": true }`.
4. Installed the local packed artifact with `bun add "$TARBALL_PATH"`.
5. Ran a smoke script importing from installed `potentia-js` and `@weipertda/sigiljs`.
6. Removed the temporary directory after success.

## Smoke script coverage

The installed package smoke verified:

- root import from `potentia-js`
- runtime dependency import from `@weipertda/sigiljs`
- `createApp(...)`
- `route(...)`
- `action(...)`
- JSON action input parsing
- `ctx.input` round-trip
- `ok(json(...))`
- `createFormState(...)`
- `projectForm(...)` with SigilJS input fields

## Smoke result

Pass.

Observed output:

```json
{"status":200,"input":{"name":"Ada"},"formField":"name","dependency":"function"}
```

## Cleanup

Temporary artifact/project directory was removed after the smoke passed.

Summary marker: `/tmp/potentia-packed-artifact-smoke-summary.txt` records the removed temp paths and cleanup status.

## Blockers

No packed-artifact install/runtime blocker was found. Registry readiness remains blocked by metadata, API pruning/stability, license/repository/CI, and publish-intent decisions.
