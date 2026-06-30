# Potentia composed basic example

A small Bun-native example for explicit route composition.

It demonstrates:

- `createRoutes`
- `mount`
- static and dynamic routes
- scoped header contracts
- route params/query/body/response contracts
- scoped hooks
- an `effect(function* ...)` route using the `call(...)` helper
- named routes with description/source metadata for manifest projection
- a tiny `createPlugin` health route
- `Bun.serve({ fetch: app.fetch })`

Run from this directory:

```bash
bun run start
```

Try:

```bash
curl http://localhost:3000/
curl -H 'x-auth: yes' 'http://localhost:3000/api/users/1?include=full'
curl -X POST http://localhost:3000/api/users \
  -H 'content-type: application/json' \
  -H 'x-auth: yes' \
  -d '{"name":"Ada"}'
curl http://localhost:3000/health
```

Notes:

- The file exports `app` so tests can call `app.fetch()` without starting a server.
- `Bun.serve()` only runs when the file is executed directly.
- Imports are source-relative in this checkout because nested example self-import is not reliable before publish prep.
- The plugin seam is intentionally tiny; there is no plugin registry or discovery system.
- No file routing, frontend, build step, compiler, database, auth, or CLI scaffolding is used.
