# File Routing Script Wrapper

## Files inspected

- `package.json`
- `src/dev/file-routing/writer.js`
- `docs/internal/file-routing-dev-wrapper-scope-lock.md`

## Files changed

- `scripts/generate-file-routes.js`
- `package.json`
- `tests/file-routing-script.test.js`
- `docs/internal/file-routing-script-wrapper.md`

## Implementation

Added internal script:

```bash
bun scripts/generate-file-routes.js
```

Added package script:

```bash
bun run generate:file-routes
```

Default behavior:

- root: `routes`
- output: `.potentia/routes.generated.js`
- package name: `potentia-js`

Supported tiny args:

```bash
bun run generate:file-routes -- --root routes --out .potentia/routes.generated.js
bun scripts/generate-file-routes.js --root routes --out .potentia/routes.generated.js --package potentia-js
```

The script uses internal `generateFileRoutes()` and prints concise success/failure output. It exits nonzero on errors.

## Boundaries preserved

- no dependencies added
- no `bin` field added
- no public CLI claim
- no watch mode
- no compiler integration
- no publish automation
- no kernel changes

## Tests

`tests/file-routing-script.test.js` verifies:

- success exit code with explicit args
- generated file exists
- generated file contains explicit route composition
- missing route root returns nonzero
- no root `.potentia/` artifact is left

## Verification

```bash
bun test tests/file-routing-script.test.js tests/file-routing-writer.test.js
```

Result:

- 8 pass
- 0 fail

## Blockers

- This is intentionally an internal repository script, not a stable public CLI.
- Default `routes`/`.potentia/routes.generated.js` behavior is useful for development but remains experimental/internal.
