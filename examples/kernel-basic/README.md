# Potentia kernel basic example

A small Bun-native source example for the experimental `potentia-js` kernel.

It demonstrates:

- `createApp`
- static routes
- dynamic route params
- query/header/body/response contracts
- one effect handler
- typed framework errors
- `Bun.serve({ fetch: app.fetch })`

Run from this directory:

```bash
bun run start
```

Try:

```bash
curl http://localhost:3000/
curl http://localhost:3000/users/123
curl -H 'x-mode: example' 'http://localhost:3000/search?q=potentia&tag=kernel&tag=bun'
curl -X POST http://localhost:3000/users \
  -H 'content-type: application/json' \
  -d '{"name":"Ada"}'
```

Notes:

- The file exports `app` so tests can call `app.fetch()` without starting a server.
- `Bun.serve()` only runs when the file is executed directly.
- Imports are source-relative in this checkout because nested example self-import is not reliable before publish prep.
- No frontend, CLI, compiler, database, or auth behavior is included.
