# Public Preview Example Smoke Report

## Files inspected

- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `examples/composed-basic/`
- `tests/kernel-basic-example.test.js`
- `tests/sigiljs-basic-example.test.js`
- `tests/composed-basic-example.test.js`
- `package.json`

## Files changed

- `docs/internal/public-preview-example-smoke-report.md`

## Import posture

- Package self-import from the repository root resolves: live import exposes 18 exports.
- Example files currently import from `../../src/index.js` because Bun did not resolve the package self-import from nested example directories in this checkout.
- This keeps examples runnable from source and avoids undeclared dependencies.
- Packaged install-from-artifact smoke is recommended for a later publish-prep block before changing examples to self-import.

## Smoke verification commands

```bash
bun -e "import * as api from 'potentia-js'; console.log(Object.keys(api).sort().length)"
bun -e "await import('./examples/kernel-basic/index.js'); await import('./examples/sigiljs-basic/index.js'); await import('./examples/composed-basic/index.js'); console.log('examples load')"
bun test tests/kernel-basic-example.test.js tests/sigiljs-basic-example.test.js tests/composed-basic-example.test.js
```

## Results

- Root package self-import resolved with 18 exports.
- All example modules loaded without starting persistent servers.
- Example smoke tests passed:
  - 12 pass
  - 0 fail
  - 24 `expect()` calls

## Example coverage

### `examples/kernel-basic/`

Verified:

- static route
- dynamic params
- query/header contracts
- body/response contracts
- effect handler path through app

### `examples/sigiljs-basic/`

Verified:

- SigilJS params/query/response contracts
- SigilJS body/response contracts
- deterministic SigilJS contract failure

### `examples/composed-basic/`

Verified:

- app root route
- mounted route collection
- scoped header contract
- route params/query contracts
- body/response contracts
- scoped after-response hook
- plugin route

## Safety notes

- Tests import app objects and call `app.fetch()` directly.
- Tests do not start persistent Bun servers.
- Examples only start `Bun.serve()` under `if (import.meta.main)`.
- No extra undeclared dependencies were required.

## Blockers

- Nested example self-import from `potentia-js` did not resolve in this checkout; examples remain source-relative for now.
- Fresh install-from-packed-artifact smoke remains a later publish-prep task.
