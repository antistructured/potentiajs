# 0.1.0 Final Publish Report

## Published package

- npm: `@potentiajs/core`
- JSR: `@potentiajs/core`
- version: `0.1.0`
- npm latest tag: `0.1.0`
- npm preview tag: `0.1.0-preview.1`

## Pass 1 — Final Pre-Publish Gate

Created:

- `docs/internal/010-final-prepublish-gate.md`

Confirmed before publish:

- `package.json` version: `0.1.0`
- `jsr.json` version: `0.1.0`
- versions match
- README documents final `0.1.0`
- CHANGELOG has `0.1.0`
- workflow computes `latest` for final and `preview` for preview versions
- `bun run test`: pass
- `bun run check:release`: pass
- `npm pack --dry-run --json`: pass
- `npx jsr publish --dry-run --allow-dirty`: pass

## Pass 2 — Commit + Publish Workflow Run

Created:

- `docs/internal/010-publish-workflow-result.md`

Commit:

- SHA: `073a17dba16c1ad03378f6cd3eec3e662cf5ad93`
- message: `Release PotentiaJS 0.1.0`
- pushed to `main`

Workflow:

- GitHub Actions run: `29115079309`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29115079309`
- conclusion: success

Jobs:

- Verify package: pass
- Publish to npm: pass
- Publish to JSR: pass

npm tag:

```txt
Package: @potentiajs/core@0.1.0
npm tag: latest
npm latest tag verified
```

## Pass 3 — npm latest Registry Verification

Created:

- `docs/internal/010-npm-latest-registry-verification.md`

Confirmed:

- npm version exists: `0.1.0`
- npm default version: `0.1.0`
- npm latest: `0.1.0`
- npm preview: `0.1.0-preview.1`
- npm tarball URL exists

Dist-tags:

```json
{
  "latest": "0.1.0",
  "preview": "0.1.0-preview.1"
}
```

## Pass 4 — JSR 0.1.0 Registry Verification

Created:

- `docs/internal/010-jsr-registry-verification.md`

Confirmed:

- JSR package visible
- JSR latest: `0.1.0`
- JSR version `0.1.0` visible
- no export parse errors
- lean artifact intact

Exports:

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js"
}
```

Artifact:

```txt
manifest count: 36
unexpected repo-only files: none
```

## Pass 5 — Fresh npm Install Smoke

Created:

- `docs/internal/010-fresh-npm-install-smoke.md`

Temp project:

- `/tmp/potentia-010-install-smoke`

Confirmed:

- `npm install @potentiajs/core` installs `0.1.0`
- root import works
- file-routing import works
- forms import works
- CLI binary exists
- root remains unpolluted

Import smoke:

```json
{
  "version": "0.1.0",
  "rootImport": true,
  "fileRoutingImport": true,
  "formsImport": true,
  "rootHasGenerateFileRoutes": false,
  "rootHasRenderForm": false
}
```

## Pass 6 — Public CLI + Generated Routes Smoke

Created:

- `docs/internal/010-public-cli-generated-routes-smoke.md`

Confirmed:

- first `routes check --json`: exit `1`, status `missing`
- `routes generate --json`: exit `0`, status `generated`
- second `routes check --json`: exit `0`, status `current`
- `.potentia/routes.generated.js` exists
- generated routes work through `createApp(...)`

App smoke:

```json
{
  "rootStatus": 200,
  "rootBody": "home",
  "userStatus": 200,
  "userBody": {
    "id": "ada"
  }
}
```

## Pass 7 — Registry Metadata / Artifact Verification

Created:

- `docs/internal/010-registry-metadata-artifact-verification.md`

npm:

- name correct
- version `0.1.0`
- description acceptable
- license `MIT`
- repository/homepage correct
- README renders final install docs
- examples ship intentionally
- `docs/internal/`, tests, generated `.potentia/` excluded

JSR:

- README/metadata visible
- version/exports visible
- artifact remains lean
- examples excluded intentionally
- CLI excluded intentionally

## Public smoke

- install: pass
- root import: pass
- file-routing import: pass
- forms import: pass
- CLI: pass
- generated routes: pass

## Registry posture

- npm examples: included intentionally
- npm docs/internal: excluded
- JSR artifact: lean, 36 manifest entries
- JSR exports: `.`, `./file-routing`, `./forms`
- README: final `0.1.0`, install docs, ZeroVer caveat, no-JSX law
- CHANGELOG: `0.1.0` entry present, preview history preserved

## Issues found

No release-blocking issues.

Non-blocking GitHub Actions warnings:

- `actions/setup-node@v4` emitted Node runtime/input warnings
- workflow still completed successfully
- public npm/JSR usability is unaffected

## Remaining blockers

None.

## Recommendation

Begin the `0.2.0` Roadmap / Capability Expansion Pass.
