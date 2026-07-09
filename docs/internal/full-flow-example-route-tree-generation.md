# Full Flow Example Route Tree / Generation

## Files inspected

- `examples/file-routing-basic/`
- `src/file-routing.js`
- `docs/internal/full-flow-example-scope-lock.md`

## Files changed

- `examples/full-flow-basic/generate.js`
- `examples/full-flow-basic/app.js`
- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/routes/index.js`
- `examples/full-flow-basic/routes/users/index.js`
- `examples/full-flow-basic/routes/users/new.js`
- `examples/full-flow-basic/routes/users/[id].js`
- `examples/full-flow-basic/routes/users/_routes.js`
- `docs/internal/full-flow-example-route-tree-generation.md`

## Route tree

Created:

```txt
examples/full-flow-basic/
  generate.js
  app.js
  form.js
  routes/
    index.js
    users/
      index.js
      new.js
      [id].js
      _routes.js
```

Projected routes:

- `GET /`
- `GET /users/new`
- `POST /users`
- `GET /users/:id`

Users scope metadata is declared in `routes/users/_routes.js`.

## Generation

`generate.js` uses:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Output path:

```txt
examples/full-flow-basic/.potentia/routes.generated.js
```

Generation was smoke-run successfully:

```txt
generated 4 route files and 1 route scopes
```

Generated output is not intended to be committed.

## App consumption

`app.js` uses:

```js
import { createApp } from '@potentiajs/core';
import routes from './.potentia/routes.generated.js';
```

No runtime filesystem scanning is introduced.

## Frontend/runtime posture

No JSX, frontend runtime, component system, hydration, client SDK, or OpenAPI code was added.

## Blockers

None.

## Publish status

No publish command was run.
