# Potentia SigilJS basic example

A focused Bun-native example for Potentia's experimental SigilJS contract boundaries.

It demonstrates:

- dynamic route params
- params/query/body/response contracts
- deterministic contract failures
- `Bun.serve({ fetch: app.fetch })`

Run from this directory:

```bash
bun run start
```

Try:

```bash
curl 'http://localhost:3000/users/1?include=nickname'
curl -X POST http://localhost:3000/users \
  -H 'content-type: application/json' \
  -d '{"name":"Ada"}'
curl http://localhost:3000/contract-error/not-a-number
```

Notes:

- The file exports `app` so tests can call `app.fetch()` without starting a server.
- `Bun.serve()` only runs when the file is executed directly.
- Imports are source-relative in this checkout because nested example self-import is not reliable before publish prep.
- No frontend, file routing, CLI, compiler, database, or auth behavior is included.
