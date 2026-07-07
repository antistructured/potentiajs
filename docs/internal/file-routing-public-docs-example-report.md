# File Routing Public Docs / Example Report

## 1. Scope completed

Completed:

- created polished public file-routing example app
- added example smoke test
- improved README file-routing walkthrough
- documented generated output policy
- decided package inclusion for public example
- kept dev/internal example repo-only
- verified tests, release check, and pack dry-run

Not performed:

- no root export change
- no subpath API change
- no CLI/bin
- no watch mode
- no compiler integration
- no new route conventions
- no new dependencies
- no release/publish workflow fixes
- no real publish

## 2. Public example location

```txt
examples/file-routing-basic/
```

## 3. Example route tree

```txt
examples/file-routing-basic/
  README.md
  generate.js
  app.js
  routes/
    index.js
    health.js
    users/
      _routes.js
      [id].js
```

Projected behavior:

- `/`
- `/health`
- `/users/:id`
- users folder scoped metadata/hook via `_routes.js`

## 4. Generation command

From the repository root:

```bash
bun examples/file-routing-basic/generate.js
```

The example uses:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Generated output path:

```txt
examples/file-routing-basic/.potentia/routes.generated.js
```

## 5. Generated output policy

Documented policy:

- generated output is inspectable JavaScript
- generated output imports `createRoutes` / `mount` from `@potentiajs/core`
- generated output imports explicit route modules
- generated output exports an explicit route collection
- generation runs during a dev/build step, not request handling
- generated output must not scan the filesystem at runtime
- `.potentia/` is ignored by default
- normal app projects usually should not commit `.potentia/`
- package authors may choose differently if intentionally shipping generated code
- generation failures report diagnostics and avoid replacing previous valid output

## 6. README updates

README now includes:

- route tree example
- public subpath import
- `generateFileRoutes(...)` example
- generated module consumption with `createApp(...)`
- explicit no-root-export / no-CLI / no-runtime-scan language
- link to `examples/file-routing-basic/`
- examples list entry for file routing

## 7. Package contents decision

Decision: ship `examples/file-routing-basic/` in the package.

Reason: the package already ships public examples, and the file-routing subpath is now public preview API.

Keep repo-only:

```txt
examples/file-routing-dev/
```

Pack dry-run confirms:

- includes `examples/file-routing-basic/`: yes
- includes `examples/file-routing-dev/`: no
- includes `.potentia/`: no
- includes `docs/internal/`: no

## 8. Tests added

Added:

```txt
tests/file-routing-basic-example.test.js
```

Coverage:

- cleans generated `.potentia/`
- runs example generation
- verifies generated header/imports/no runtime fs import
- imports generated app
- verifies `/`, `/health`, `/users/ada`
- verifies scoped users hook headers
- cleans generated output

## 9. Checks

### Tests

```txt
565 pass
0 fail
1221 expect() calls
```

### Release check

```txt
565 pass
0 fail
1221 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 55
examples/file-routing-basic/: included
docs/internal/: excluded
examples/file-routing-dev/: excluded
.potentia/: excluded
```

## 10. Remaining limitations

Still deferred:

- stable API guarantees
- public CLI/bin
- watch mode
- compiler integration
- named method exports
- TypeScript route files
- catch-all / optional / group route syntax
- runtime filesystem scanning
- frontend/page/layout conventions
- release blocker fixes

## 11. Recommendation

File Routing Public Docs / Example App Pass is complete.

Recommended next if continuing file routing:

```txt
File Routing CLI Design Gate
```

Recommended next if prioritizing release health:

```txt
Release Blocker Fix Pass
```

## Publish status

No publish command was run.
