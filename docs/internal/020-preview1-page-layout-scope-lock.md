# 0.2.0-preview.1 Page/Layout Scope Lock

## Target

```txt
0.2.0-preview.1
```

This block extends the verified `0.2.0-preview.0` HTML foundation into a small server-first page composition layer.

## Files inspected

- `docs/internal/020-roadmap-report.md`
- `docs/internal/020-preview0-final-publish-report.md`
- `src/html.js`
- `src/html.d.ts`
- `tests/html.test.js`
- `examples/html-basic/index.js`
- `examples/html-basic/README.md`
- `examples/full-flow-basic/app.js`
- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/README.md`
- `tests/full-flow-basic-example.test.js`
- `README.md`
- `CHANGELOG.md`
- `package.json`
- `jsr.json`

## Files changed

- `docs/internal/020-preview1-page-layout-scope-lock.md`

## Allowed scope

Add only the preview.1 page/layout integration surface:

- `page(...)`
- `layout(...)`
- runtime exports from `@potentiajs/core/html`
- type declarations in `src/html.d.ts`
- tests in `tests/html.test.js`
- `examples/html-basic` update
- `examples/full-flow-basic` usage integration
- README/CHANGELOG/version prep after implementation is complete
- internal verification docs for this block

Public export posture:

- subpath only: `@potentiajs/core/html`
- no root exports
- no new package subpath
- no package split

## Forbidden

This block must not add or introduce:

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
- form behavior changes beyond example usage composition
- manual publish

## Version posture

No version bump is performed in this pass. Version remains:

```txt
0.2.0-preview.0
```

The version bump is reserved for the version/changelog pass after implementation and examples pass.

## Blockers

None.
