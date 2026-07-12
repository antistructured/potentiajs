# 0.2.0-preview.0 Final Publish Report

## Published package

- npm: `@potentiajs/core`
- JSR: `@potentiajs/core`
- version: `0.2.0-preview.0`
- npm latest tag: `0.1.0`
- npm preview tag: `0.2.0-preview.0`

## Pass 1 — Pre-Publish Readiness Gate

Created:

- `docs/internal/020-preview0-prepublish-readiness-gate.md`

Confirmed before publish:

- `package.json` version: `0.2.0-preview.0`
- `jsr.json` version: `0.2.0-preview.0`
- versions match
- CHANGELOG has `0.2.0-preview.0`
- README documents `@potentiajs/core/html`
- package exports include `./html`
- JSR exports include `./html`
- root exports remain unchanged
- `examples/html-basic` exists
- tests pass
- release check passes
- npm pack includes `src/html.js` and `src/html.d.ts`
- JSR dry-run includes `src/html.js` and `src/html.d.ts`

Local test result:

```txt
630 pass
0 fail
1529 expect() calls
```

## Pass 2 — Commit + Publish Workflow Run

Created:

- `docs/internal/020-preview0-publish-workflow-result.md`

Actual publish commit:

- SHA: `52d0e54d95b6b63e6612839fa192021871658952`
- message: `feat(html): add 0.2.0-preview.0 HTML foundation`
- workflow run: `29166847371`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29166847371`
- conclusion: success

Verification-doc commit:

- SHA: `24425f84353f12ef0bf5c3a1e8257e9f77f0d9b8`
- message: `Release PotentiaJS 0.2.0-preview.0`
- workflow run: `29166955318`
- URL: `https://github.com/antistructured/potentiajs/actions/runs/29166955318`
- conclusion: success

Jobs:

- Verify package: pass
- Publish to npm: pass
- Publish to JSR: pass
- npm preview tag verification: pass

npm tag:

```txt
Package: @potentiajs/core@0.2.0-preview.0
npm tag: preview
npm preview tag verified
npm latest remained 0.1.0
```

The implementation publish workflow performed the actual publication. The later verification-doc workflow saw the version already existed and skipped publish steps while still verifying the preview tag.

## Pass 3 — npm Preview Registry Verification

Created:

- `docs/internal/020-preview0-npm-registry-verification.md`

Confirmed:

- npm version exists: `0.2.0-preview.0`
- npm preview: `0.2.0-preview.0`
- npm latest: `0.1.0`
- npm tarball URL exists
- package name: `@potentiajs/core`

Dist-tags:

```json
{
  "preview": "0.2.0-preview.0",
  "latest": "0.1.0"
}
```

## Pass 4 — JSR Preview Registry Verification

Created:

- `docs/internal/020-preview0-jsr-registry-verification.md`

Confirmed:

- JSR package visible
- JSR version `0.2.0-preview.0` visible
- JSR default/latest remains `0.1.0`, expected for preview
- no export parse errors
- artifact remains lean

Exports:

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js",
  "./html": "./src/html.js"
}
```

Artifact:

```txt
manifest count: 38
unexpected repo-only files: none
```

## Pass 5 — Fresh npm Install + Import Smoke

Created:

- `docs/internal/020-preview0-fresh-npm-install-smoke.md`

Temp project:

- `/tmp/potentia-020-preview0-install-smoke`

Confirmed:

- `npm install @potentiajs/core@preview` installs `0.2.0-preview.0`
- root import works
- file-routing import works
- forms import works
- HTML import works
- root remains unpolluted

Import smoke:

```json
{
  "version": "0.2.0-preview.0",
  "rootImport": true,
  "fileRoutingImport": true,
  "formsImport": true,
  "htmlImport": true,
  "rootHtmlPollution": false
}
```

## Pass 6 — HTML Public API Smoke

Created:

- `docs/internal/020-preview0-html-public-api-smoke.md`

Confirmed from the public npm-installed package:

- `escapeHtml` works
- `html` escapes interpolation
- `raw(...)` renders trusted content
- `attrs(...)` renders class arrays
- `fragment(...)` works
- `htmlResponse(...)` returns valid HTML `Response`

Smoke result:

```json
{
  "escapeHtml": true,
  "html": true,
  "raw": true,
  "attrs": true,
  "fragment": true,
  "htmlResponse": true
}
```

## Pass 7 — Registry Metadata / Artifact Verification

Created:

- `docs/internal/020-preview0-registry-metadata-artifact-verification.md`

npm:

- name correct
- version `0.2.0-preview.0`
- description acceptable
- license `MIT`
- repository/homepage correct
- installed package README documents `@potentiajs/core/html`
- `examples/html-basic` ships intentionally
- `docs/internal/`, tests, generated `.potentia/` excluded

JSR:

- metadata/version reachable
- exports visible, including `./html`
- artifact remains lean
- examples excluded intentionally
- CLI excluded intentionally

## Public smoke

- install: pass
- root import: pass
- file-routing import: pass
- forms import: pass
- html import: pass
- root pollution: none

## HTML API

- `escapeHtml`: pass
- `html`: pass
- `raw`: pass
- `attrs`: pass
- `fragment`: pass
- `htmlResponse`: pass

## Registry posture

- npm `examples/html-basic`: included intentionally
- npm `docs/internal`: excluded
- JSR artifact: lean, 38 manifest entries
- JSR exports: `.`, `./file-routing`, `./forms`, `./html`
- README: installed package README documents HTML subpath and preview posture
- CHANGELOG: `0.2.0-preview.0` entry present in published package

## Issues found

No release-blocking issues.

Non-blocking notes:

- `npm view @potentiajs/core@preview readme` returned an empty string, while the registry-installed package includes the expected README with HTML docs.
- GitHub Actions emitted setup-node warnings; publication and public smoke checks were unaffected.

## Remaining blockers

None.

## Recommendation

Begin `0.2.0-preview.1` Page/Layout Integration Pass.
