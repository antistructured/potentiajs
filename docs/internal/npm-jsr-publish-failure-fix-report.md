# npm / JSR Publish Failure Fix Report

## Summary

This pass fixed/stabilized the two reported publish workflow failures without changing PotentiaJS framework APIs.

Failures were separate:

1. npm publish entered provenance internals and failed resolving `sigstore`.
2. JSR publish rejected npm-style conditional exports in `jsr.json`.

No real publish command was run.

## Pass 1 — Publish Failure Scope Lock

Created:

- `docs/internal/npm-jsr-publish-failure-scope-lock.md`

Result:

- npm failure scoped to npm/provenance/toolchain path
- JSR failure scoped to registry config export shape
- no framework feature/API/version work in scope
- no real publish allowed in this pass

## Pass 2 — npm Provenance / Node Toolchain Audit

Created:

- `docs/internal/npm-provenance-node-toolchain-audit.md`

Findings:

- `publishConfig.provenance`: absent
- `.npmrc`: absent
- `.npmrc provenance=true`: absent
- workflow `NPM_CONFIG_PROVENANCE`: absent before stabilization
- publish workflow used Node 24 before stabilization
- publish workflow upgraded npm to latest before stabilization
- workflow has `id-token: write`
- npm publish job did not set `NODE_AUTH_TOKEN` before stabilization

Cause:

```txt
Node 24 / latest npm / OIDC-enabled workflow context likely entered npm provenance internals and hit a missing sigstore module.
```

## Pass 3 — npm Publish Workflow Stabilization

Changed:

- `.github/workflows/publish.yml`
- `.github/workflows/publish-preview.yaml`
- `package.json`

Created:

- `docs/internal/npm-publish-workflow-stabilization.md`

Fixes:

- Node 24 replaced with Node 22 in publish workflow jobs
- `actions/setup-node@v6` replaced with `actions/setup-node@v4`
- removed `npm install -g npm@latest`
- npm real publish command now uses:

```bash
npm publish --access public --tag preview --provenance=false
```

with:

```yaml
env:
  NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
  NPM_CONFIG_PROVENANCE: "false"
```

- preview dry-run now uses:

```bash
npm publish --dry-run --tag preview --provenance=false
```

with:

```yaml
env:
  NPM_CONFIG_PROVENANCE: "false"
```

- `publishConfig` now keeps public scoped access and adds preview tag:

```json
{
  "access": "public",
  "tag": "preview"
}
```

## Pass 4 — JSR Export Shape Fix

Created:

- `docs/internal/jsr-export-shape-fix.md`

Current `jsr.json` already had the corrected JSR shape:

```json
{
  "exports": {
    ".": "./src/index.js",
    "./file-routing": "./src/file-routing.js",
    "./forms": "./src/forms.js"
  }
}
```

No JSON patch was required for `jsr.json` in this pass.

The remote failure came from an older/npm-style conditional export shape.

## Pass 5 — JSR Publish Workflow Stabilization

Changed:

- `.github/workflows/publish.yml`

Created:

- `docs/internal/jsr-publish-workflow-stabilization.md`

Stabilization:

- JSR publish job now also uses Node 22 with `actions/setup-node@v4`
- JSR command remains:

```bash
npx jsr publish
```

- JSR job still depends on shared `verify`
- workflow keeps `id-token: write` for registry/OIDC publishing
- generated `.potentia/` output remains excluded by `jsr.json`

## Pass 6 — Local Dry Checks

Created:

- `docs/internal/npm-jsr-publish-failure-dry-checks.md`

Commands:

```txt
bun run test: pass — 609 pass, 0 fail, 1487 expect() calls
bun run check:preview: pass — 609 pass, 0 fail, 1487 expect() calls
bun run check:release: pass — 609 pass, 0 fail, 1487 expect() calls
npm pack --dry-run --json: pass — 70 entries
npm publish --dry-run --access public --provenance=false: pass
npx jsr publish --dry-run: fails only because working tree is dirty
npx jsr publish --dry-run --allow-dirty: pass — Success Dry run complete
```

Important checks:

- npm `sigstore` failure: gone
- JSR conditional export parse failure: gone
- no real publish occurred
- pack excludes `docs/internal/`
- pack excludes generated `.potentia/`

## npm

- cause: npm publish entered provenance internals under the previous Node 24 / latest npm / OIDC-capable workflow setup and failed resolving `sigstore`.
- fix: use Node 22, stop upgrading npm to latest, explicitly disable provenance, use token-based publish env, and use preview dist-tag for prerelease publish.
- node: Node 22 in publish workflow.
- provenance: explicitly disabled with `--provenance=false` and `NPM_CONFIG_PROVENANCE=false`.

## JSR

- cause: older `jsr.json` shape used npm conditional exports, which JSR does not accept.
- fix: current `jsr.json` uses direct string export paths and dry-run validates successfully.
- exports:
  - `.` → `./src/index.js`
  - `./file-routing` → `./src/file-routing.js`
  - `./forms` → `./src/forms.js`

## Remaining blockers

For real npm publish:

- GitHub secret `NPM_TOKEN` must exist and have publish rights.
- npm package/scoped package access must be valid.

For real JSR publish:

- JSR registry authorization/OIDC/project setup must be valid at workflow runtime.
- clean git state is required unless intentionally using `--allow-dirty` for local dry-run only.

Non-blocking follow-up:

- npm dry-run emits an npm auto-correction warning for the bin path but still includes `bin.potentia` in packed `package.json`; inspect after real publish if CLI installation behavior matters.

## Recommendation

Commit these workflow/config fixes, then rerun the GitHub publish workflow.

If npm and JSR both publish successfully, run a post-publish registry verification pass:

- npm package/version visible
- npm install smoke for `@potentiajs/core`
- JSR package/version visible
- subpath import smoke for `@potentiajs/core/file-routing` and `@potentiajs/core/forms`
