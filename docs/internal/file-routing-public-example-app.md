# File Routing Public Example App

## Files inspected

- `examples/file-routing-dev/README.md`
- existing public example app patterns under `examples/`
- `src/file-routing.js`
- `package.json`

## Files changed

Created:

- `examples/file-routing-basic/README.md`
- `examples/file-routing-basic/generate.js`
- `examples/file-routing-basic/app.js`
- `examples/file-routing-basic/routes/index.js`
- `examples/file-routing-basic/routes/health.js`
- `examples/file-routing-basic/routes/users/[id].js`
- `examples/file-routing-basic/routes/users/_routes.js`
- `docs/internal/file-routing-public-example-app.md`

## Example route tree

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

## Public API usage

`generate.js` imports the public subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

It writes generated output to:

```txt
examples/file-routing-basic/.potentia/routes.generated.js
```

## App usage

`app.js` consumes the generated explicit route module:

```js
import { createApp } from '@potentiajs/core';
import routes from './.potentia/routes.generated.js';

export const app = createApp({
  routes: [routes]
});
```

## Example routes

- `/` from `routes/index.js`
- `/health` from `routes/health.js`
- `/users/:id` from `routes/users/[id].js`

The `users/_routes.js` file contributes scoped metadata and an `afterResponse` hook for the users folder.

## Boundaries preserved

- no CLI/bin
- no watch mode
- no compiler integration
- no runtime filesystem scanning
- no source API changes
- no root export changes

## Blockers

None.

## Publish status

No publish command was run.
