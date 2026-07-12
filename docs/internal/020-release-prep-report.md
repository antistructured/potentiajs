# 0.2.0 Release Prep Report

## Outcome

Prepared final `0.2.0` release readiness for:

```txt
@potentiajs/core@0.2.0
```

No manual publish was run.

## Pass 1 — 0.2.0 Final Scope Lock

Created:

- `docs/internal/020-final-scope-lock.md`

Locked final `0.2.0` meaning:

- second public foundation release
- HTML-first server response layer promoted into public previewed framework surface
- still experimental under ZeroVer
- not a 1.0 stability guarantee

Included:

- safe HTML values
- escape by default
- explicit raw trust boundary
- tagged HTML templates
- fragments
- safe attrs
- HTML responses
- page document shell
- layout functions
- examples

Excluded:

- JSX
- compiler
- client runtime
- hydration
- virtual DOM
- component model
- CSS system
- SPA routing
- new API design

## Pass 2 — Preview Line Review

Created:

- `docs/internal/020-preview-line-review.md`

Reviewed:

- `0.2.0-preview.0`: published and verified
- `0.2.0-preview.1`: published and verified

Registry state before final:

```json
{
  "latest": "0.1.0",
  "preview": "0.2.0-preview.1"
}
```

Fresh preview-line public smoke passed from `@preview`:

```json
{
  "version": "0.2.0-preview.1",
  "install": true,
  "root": true,
  "fileRouting": true,
  "forms": true,
  "html": true,
  "pageLayout": true,
  "rootPollution": false
}
```

## Pass 3 — Public API Final Review

Created:

- `docs/internal/020-public-api-final-review.md`

Root exports remain focused on the core kernel.

Subpaths:

- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`
- `@potentiajs/core/html`

HTML subpath exports:

- `attrs`
- `escapeHtml`
- `fragment`
- `html`
- `htmlResponse`
- `layout`
- `page`
- `raw`

Confirmed private/internal:

- HTML helpers not root-exported
- file-routing helper not root-exported
- forms renderer not root-exported
- CLI internals not root-exported
- safe HTML marker/class not exported

## Pass 4 — README Final 0.2 Review

Created:

- `docs/internal/020-readme-final-review.md`

Changed README to final `0.2.0` posture:

- current version `0.2.0`
- HTML-first response and page composition foundation
- subpath-only HTML helpers in `0.2.0`
- `page` / `layout` included in examples and export list
- `examples/html-basic` listed
- full-flow example description updated
- release/publish status targets final `0.2.0`

Confirmed README still says:

- experimental under ZeroVer
- not production-ready
- not 1.0 stability
- no JSX / compiler / client runtime / hydration / virtual DOM direction

## Pass 5 — CHANGELOG 0.2.0 Final Entry

Created:

- `docs/internal/020-changelog-final-entry.md`

Added final `0.2.0` changelog entry above preview entries.

Entry covers:

- `@potentiajs/core/html`
- safe HTML values
- `raw(...)`
- tagged `html`
- `fragment(...)`
- `attrs(...)`
- `htmlResponse(...)`
- `page(...)`
- `layout(...)`
- `examples/html-basic`
- `examples/full-flow-basic` HTML page response integration

Preview history remains preserved.

## Pass 6 — Package Metadata / Registry Posture Review

Created:

- `docs/internal/020-package-registry-posture-review.md`

Confirmed:

- package name: `@potentiajs/core`
- description accurate
- license: `MIT`
- repository/homepage correct
- exports include `./html`
- npm files include `src/`, examples, README, CHANGELOG, LICENSE
- npm examples intentionally included
- JSR examples intentionally excluded
- JSR artifact configured lean
- CLI remains npm-only
- publish workflow computes:
  - `latest` for final versions
  - `preview` for preview versions

## Pass 7 — Fresh Consumer Smoke Checklist

Created:

- `docs/internal/020-fresh-consumer-smoke-check.md`

Checklist covers post-publish verification for:

- `npm install @potentiajs/core`
- root import
- file-routing import
- forms import
- html import
- page/layout import
- root non-pollution
- HTML API smoke
- page/layout smoke
- CLI generated routes smoke

## Pass 8 — Version Bump Prep

Created:

- `docs/internal/020-version-bump-prep.md`

Version:

- previous: `0.2.0-preview.1`
- current: `0.2.0`

Changed:

- `package.json`
- `jsr.json`

Confirmed:

- package version is `0.2.0`
- JSR version is `0.2.0`
- versions match
- README reflects `0.2.0`
- CHANGELOG has final `0.2.0` entry

## Pass 9 — Full Release Gate

Created:

- `docs/internal/020-full-release-gate.md`

Commands run:

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npx jsr publish --dry-run --allow-dirty
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
bun run examples/html-basic/index.js
bun test tests/full-flow-basic-example.test.js
```

Results:

```txt
640 pass
0 fail
1558 expect() calls
```

`check:release`: pass

npm pack:

- package: `@potentiajs/core@0.2.0`
- file count: `60`
- includes `src/html.js`
- includes `src/html.d.ts`
- includes `examples/html-basic/`
- includes `examples/full-flow-basic/`
- excludes `docs/internal/`
- excludes `tests/`

JSR dry-run:

- pass
- includes `src/html.js`
- includes `src/html.d.ts`
- exports include `./html`

Examples:

- `examples/html-basic`: pass
- `examples/full-flow-basic`: pass

Root export audit:

```json
{
  "rootHasHtml": []
}
```

## Version

- previous: `0.2.0-preview.1`
- current: `0.2.0`

## Public API

- root: core kernel APIs only; no HTML/file-routing/forms-renderer pollution
- file-routing: `generateFileRoutes`
- forms: `renderForm`
- html: `html`, `raw`, `escapeHtml`, `attrs`, `fragment`, `htmlResponse`, `page`, `layout`

## HTML API

- `html`: tagged template, safe interpolation
- `raw`: explicit trusted HTML boundary
- `escapeHtml`: escapes plain values
- `attrs`: safe attribute rendering
- `fragment`: child composition without comma joining
- `htmlResponse`: standard HTML `Response`
- `page`: HTML document shell composition
- `layout`: reusable server-first layout functions

## Release posture

- npm final tag: expected `latest -> 0.2.0`
- npm preview tag: expected to remain `preview -> 0.2.0-preview.1`
- JSR: final `0.2.0` dry-run passes; publish workflow should publish exact version if absent
- ZeroVer warning: preserved
- no JSX law: preserved
- no compiler/client-runtime/hydration/virtual-DOM posture: preserved

## Examples

- `html-basic`: demonstrates HTML helpers, page/layout, and `htmlResponse(page(...))`
- `full-flow-basic`: composes file routing, actions, forms, page/layout HTML responses, form state failures, and redirect success

## Tests

- `bun test`: pass — `640 pass`, `0 fail`, `1558 expect() calls`
- `check:release`: pass
- `npm pack`: pass
- `JSR dry-run`: pass

## Remaining blockers

None.

## Recommendation

Commit and run the publish workflow for `0.2.0`.
