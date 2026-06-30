# Kernel Example DX Polish

## Files inspected

- `examples/kernel-basic/index.js`
- `examples/kernel-basic/README.md`
- `examples/sigiljs-basic/index.js`
- `examples/sigiljs-basic/README.md`
- `examples/composed-basic/index.js`
- `examples/composed-basic/README.md`
- `tests/kernel-basic-example.test.js`
- `tests/sigiljs-basic-example.test.js`
- `tests/composed-basic-example.test.js`

## Files changed

- `examples/kernel-basic/index.js`
- `examples/kernel-basic/README.md`
- `examples/sigiljs-basic/index.js`
- `examples/sigiljs-basic/README.md`
- `examples/composed-basic/README.md`
- `docs/internal/kernel-example-dx-polish.md`

## Changes

### Kernel basic example

- Removed a no-op app-level hook to reduce noise.
- Kept one effect handler on the dynamic route so effect usage remains visible.
- Tightened README to show fewer requests and explain test-safe server startup.

### SigilJS basic example

- Changed the GET route from an effect handler to a plain handler so the example focuses on SigilJS contracts.
- Tightened README around params/query/body/response contracts and deterministic failures.

### Composed basic example

- Kept source behavior unchanged.
- Tightened README around route composition, scoped contracts/hooks, and the intentionally tiny plugin seam.

## Import posture

Examples keep source-relative imports:

```js
import { ... } from '../../src/index.js';
```

Reason: package self-import from nested example directories did not resolve reliably in this checkout before publish prep. This limitation is now documented in each example README.

## Verification

```bash
bun test tests/kernel-basic-example.test.js tests/sigiljs-basic-example.test.js tests/composed-basic-example.test.js
```

Result:

- 12 pass
- 0 fail

## Blockers

- Fresh install-from-packed-artifact example smoke remains deferred to publish prep.
- No frontend/build/CLI examples were added by design.
