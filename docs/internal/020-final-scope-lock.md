# 0.2.0 Final Scope Lock

## Target

```txt
@potentiajs/core@0.2.0
```

`0.2.0` is the second serious public ZeroVer foundation release for PotentiaJS. It promotes the HTML-first response/page composition work from the 0.2 preview line into the next public release.

## Files inspected

- `docs/internal/020-roadmap-report.md`
- `docs/internal/020-preview0-final-publish-report.md`
- `docs/internal/020-preview1-final-publish-report.md` — not present in the current checkout at inspection time
- `src/html.js`
- `src/html.d.ts`
- `tests/html.test.js`
- `examples/html-basic/`
- `examples/full-flow-basic/`
- `README.md`
- `CHANGELOG.md`
- `package.json`
- `jsr.json`
- `.github/workflows/publish.yml`

## Files changed

- `docs/internal/020-final-scope-lock.md`

## Final 0.2.0 meaning

`0.2.0` means:

- second public foundation release
- HTML-first server response layer is part of the public previewed framework surface
- server-first page composition is available through `@potentiajs/core/html`
- PotentiaJS remains experimental under ZeroVer
- APIs may still evolve before a future stable release
- this is not a `1.0` stability guarantee

Correct public framing:

```txt
PotentiaJS 0.2.0 adds a server-first, HTML-first response and page composition layer on top of the 0.1.0 routing/actions/forms foundation.
```

## Included features

HTML subpath features included in final scope:

- safe HTML values
- escape by default
- explicit trusted HTML through `raw(...)`
- tagged `html` templates
- `fragment(...)`
- `attrs(...)`
- `htmlResponse(...)`
- `page(...)`
- `layout(...)`
- `examples/html-basic`
- `examples/full-flow-basic` page/layout integration

## Public API

Subpath:

```txt
@potentiajs/core/html
```

Final HTML exports:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`
- `page`
- `layout`

Existing subpaths remain:

- `@potentiajs/core/file-routing`
- `@potentiajs/core/forms`
- `@potentiajs/core/html`

## Root export posture

No HTML helpers are root-exported.

Excluded from root:

- `html`
- `raw`
- `escapeHtml`
- `attrs`
- `fragment`
- `htmlResponse`
- `page`
- `layout`
- internal safe HTML marker / branding

## Excluded work

This final release prep does not add:

- new API design
- JSX
- compiler
- template file format
- client runtime
- hydration
- virtual DOM
- React-like component identity
- component model
- CSS system
- SPA routing
- metadata DSL
- asset pipeline
- script/style helper APIs
- routing behavior changes
- action behavior changes
- form behavior changes
- manual publish

## Laws preserved

- no JSX law
- no compiler law
- no client-runtime law
- no hydration law
- no virtual DOM law
- server-first / HTML-first direction
- explicit trust boundaries
- escape by default

## Version posture

No version bump was performed in this pass.

Current inspected versions:

- `package.json`: `0.2.0-preview.1`
- `jsr.json`: `0.2.0-preview.1`

The final version bump to `0.2.0` is reserved for the version bump pass after review docs are complete.

## Blockers

None for scope lock.

Potential follow-up item for Pass 2:

- `docs/internal/020-preview1-final-publish-report.md` is not present in the current checkout, so Pass 2 must verify preview.1 registry state directly instead of relying on that report.
