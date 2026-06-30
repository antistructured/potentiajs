# File Routing Dev Example

This example demonstrates Potentia's internal/dev-only file-routing projection workflow.

It is not a stable public API and not a public CLI contract.

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

- stable public file-routing API
- public CLI/bin command
- watch mode
- compiler integration
- runtime filesystem scanning
