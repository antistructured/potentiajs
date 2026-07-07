# File Routing Public Docs / Example Update

## Files inspected

- `README.md`
- `examples/file-routing-dev/README.md`
- package files allowlist

## Files changed

- `README.md`
- `examples/file-routing-dev/README.md`
- `docs/internal/file-routing-public-docs-example.md`

## README updates

README now documents the experimental public subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';

await generateFileRoutes({
  rootDir: 'routes',
  outputFile: '.potentia/routes.generated.js'
});
```

README also states:

- file routing is a package subpath, not a root export
- generated modules import `createRoutes(...)` / `mount(...)` from `@potentiajs/core`
- generated output is explicit route composition
- `.potentia/` is ignored by default
- runtime kernel does not perform production runtime filesystem scanning
- public CLI/watch/compiler integration remains deferred
- API is experimental and not stable

## Example updates

`examples/file-routing-dev/README.md` now says:

- the public preview API is `@potentiajs/core/file-routing`
- the repo example still uses the internal script wrapper for local convenience
- the script wrapper is not a public CLI contract
- stable guarantees beyond the experimental subpath remain deferred

The example remains repo-only and is not added to package files.

## Claims intentionally avoided

Docs do not claim:

- CLI support
- watch mode
- compiler integration
- TypeScript route files
- named method exports
- catch-all/optional/group routes
- frontend/page/layout conventions
- runtime request-time filesystem scanning

## Blockers

None for this pass.

## Publish status

No publish command was run.
