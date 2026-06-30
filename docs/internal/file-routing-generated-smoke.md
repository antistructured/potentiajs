# File Routing Generated Smoke

## Files inspected

- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/scanner.js`
- `tests/fixtures/file-routing-app/`

## Files changed

- `tests/fixtures/file-routing-app/routes/index.js`
- `tests/fixtures/file-routing-app/routes/health.js`
- `tests/fixtures/file-routing-app/routes/_private.js`
- `tests/fixtures/file-routing-app/routes/users/_routes.js`
- `tests/fixtures/file-routing-app/routes/users/index.js`
- `tests/fixtures/file-routing-app/routes/users/[id].js`
- `tests/fixtures/file-routing-app/routes/users/_private.js`
- `tests/file-routing-generated-smoke.test.js`
- `docs/internal/file-routing-generated-smoke.md`

## Smoke flow

The smoke test proves the full projection path:

1. scan fixture `routes/`
2. generate route module source
3. write generated source to fixture-local `.potentia/routes.generated.js`
4. import generated module
5. create app with `createApp({ routes: [generatedRoutes] })`
6. send requests through `app.fetch`
7. cleanup fixture `.potentia/` and temporary fixture `node_modules/`

## Verified routes

- `/`
- `/health`
- `/users`
- `/users/:id`
- `/_private` returns 404
- users scope metadata applies hooks/contracts
- missing scoped header produces deterministic contract failure

## Verification

```bash
bun test tests/file-routing-generated-smoke.test.js
```

Result:

- 1 pass
- 0 fail

Additional cleanup assertion:

```bash
test ! -e tests/fixtures/file-routing-app/.potentia
test ! -e tests/fixtures/file-routing-app/node_modules
```

Result: pass.

## Boundary check

Generated output imports `createRoutes` and `mount` from `potentia-js` and uses explicit route composition. The generated source contains no filesystem scanning code.

## Blockers

- Test uses a temporary fixture-local package self-import symlink so Bun can resolve `potentia-js` from generated fixture output. The symlink is removed after the smoke test.
- CLI/write helper remains deferred.
