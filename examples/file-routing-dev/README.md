# File Routing Dev Example

This repo-only example demonstrates Potentia's file-routing projection workflow.

The public preview API is the package subpath `@potentiajs/core/file-routing`, which exports `generateFileRoutes(...)`. This example still uses the repository's internal script wrapper for local development convenience; it is not a public CLI contract.

## Shape

```txt
routes/
  index.js
  users/
    _routes.js
    index.js
    [id].js
.potentia/routes.generated.js
index.js
```

The generated file is created by the internal development script/helper and then consumed explicitly:

```js
import { createApp } from '../../src/index.js';
import generatedRoutes from './.potentia/routes.generated.js';

export const app = createApp({
  routes: [generatedRoutes]
});
```

## Generate locally

From the repository root:

```bash
bun run generate:file-routes -- --root examples/file-routing-dev/routes --out examples/file-routing-dev/.potentia/routes.generated.js
```

The `.potentia/` directory is generated output and is ignored by default.

Deferred intentionally:

- stable file-routing API guarantees beyond the experimental subpath
- public CLI/bin command
- watch mode
- compiler integration
- runtime filesystem scanning
