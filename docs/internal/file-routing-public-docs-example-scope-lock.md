# File Routing Public Docs / Example Scope Lock

## Files inspected

- `README.md`
- `examples/file-routing-dev/README.md`
- `examples/file-routing-dev/`
- `src/file-routing.js`
- `src/file-routing.d.ts`
- `src/dev/file-routing/`
- `tests/file-routing-*.test.js`
- `package.json`
- `.gitignore`
- `docs/internal/file-routing-public-api-foundation-scope-lock.md`
- `docs/internal/file-routing-public-package-smoke.md`
- `docs/internal/file-routing-public-docs-example.md`

## Scope lock

This block is documentation/example/test work only.

Allowed changes:

- create a polished public file-routing example app
- add an example README
- add example smoke tests
- improve the README file-routing walkthrough
- document generated output policy
- decide package inclusion for the public example
- write internal reports for this docs/example pass

Disallowed changes:

- no source API behavior changes
- no root export changes
- no package subpath API changes
- no CLI/bin
- no watch mode
- no compiler integration
- no new routing conventions
- no new dependencies
- no release workflow fixes
- no npm/JSR publish or registry recovery

## Decisions

### Public example location

Create a new public example:

```txt
examples/file-routing-basic/
```

Reason:

- `examples/file-routing-dev/` is still oriented around the repo's internal script wrapper.
- The new public API deserves a focused example that imports `@potentiajs/core/file-routing` directly.
- Keeping the public example separate avoids blurring public API guidance with internal/dev wrapper history.

### Existing dev example status

Keep `examples/file-routing-dev/` repo-only.

Reason:

- It documents the internal script wrapper and prior dev flow.
- It is useful for repo development but is not the polished public package example.

### Package contents decision to resolve later

The recommended default is to ship `examples/file-routing-basic/` because the package already ships selected public examples.

This pass does not update package contents yet; the explicit package decision is made in Pass 6 after the example and smoke test exist.

### Public docs gaps

Current README mentions the subpath but lacks:

- a route tree walkthrough
- a generated route usage example
- a public example link
- a clear `route files → generateFileRoutes(...) → generated module → createApp(...)` flow
- fuller guidance about generated output and `.potentia/`

## Out of scope

- public CLI command
- `bin` field
- watch mode
- config files
- TypeScript route files
- named `GET` / `POST` exports
- catch-all / optional / group route syntax
- runtime filesystem scanning
- frontend/page/layout conventions
- release blocker fixes
- real publish

## Publish status

No publish command was run.
