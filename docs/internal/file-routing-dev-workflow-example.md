# File Routing Dev Workflow Example

## Files inspected

- `src/dev/file-routing/writer.js`
- `examples/`
- `tests/file-routing-generated-smoke.test.js`
- `docs/internal/file-routing-dev-wrapper-scope-lock.md`

## Files changed

- `examples/file-routing-dev/index.js`
- `examples/file-routing-dev/README.md`
- `examples/file-routing-dev/routes/index.js`
- `examples/file-routing-dev/routes/users/index.js`
- `examples/file-routing-dev/routes/users/[id].js`
- `examples/file-routing-dev/routes/users/_routes.js`
- `tests/file-routing-dev-example.test.js`
- `docs/internal/file-routing-dev-workflow-example.md`

## Example behavior

The example demonstrates:

- a `routes/` folder
- root `index.js`
- nested `users/index.js`
- dynamic `users/[id].js`
- folder metadata `users/_routes.js`
- generated `.potentia/routes.generated.js`
- explicit consumption through `createApp()`

Example app shape:

```js
import { createApp } from '../../src/index.js';
import generatedRoutes from './.potentia/routes.generated.js';

export const app = createApp({
  routes: [generatedRoutes]
});
```

The generated `.potentia/` output is not committed and is cleaned by tests.

## Test behavior

`tests/file-routing-dev-example.test.js`:

1. runs `generateFileRoutes()` for `examples/file-routing-dev/routes`
2. writes `examples/file-routing-dev/.potentia/routes.generated.js`
3. imports the example app
4. verifies `/`, `/users`, `/users/:id`
5. verifies scoped header contract failure
6. removes generated `.potentia/` output

## Verification

```bash
bun test tests/file-routing-dev-example.test.js
```

Result:

- 1 pass
- 0 fail

## Boundaries preserved

- example README clearly marks the workflow internal/dev-only
- no stable public API claim
- no public CLI/bin claim
- generated routes are consumed explicitly
- no runtime filesystem scanning

## Blockers

- Example is not currently shipped in package `files`.
- Public docs for consumers remain deferred until file routing is promoted beyond internal/dev-only status.
