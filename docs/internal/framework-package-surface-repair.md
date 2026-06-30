# Framework Package Surface Repair

## Files inspected

- `package.json`
- `src/index.mjs`
- `src/`
- `README.md`
- `docs/internal/framework-kernel-scope-lock.md`

## Work completed

- Added `src/index.js` as the new public ESM package entrypoint.
- Updated package metadata to resolve imports through `./src/index.js`.
- Added an `exports` map for the package root.
- Added `type: "module"` so `.js` source can use ES module syntax without a build step.
- Left old `src/index.mjs` untouched as a prototype server file, but removed it from the public import path.

## Package surface

Current intended public path:

- `import { ... } from 'potentia-js'` -> `./src/index.js`

The package name remains `potentia-js` and the version remains `0.0.1`.

## Dependency posture

- No runtime dependencies added.
- No dev dependencies added.
- No build step added.

## Notes

The entrypoint is intentionally minimal at this pass. Subsequent kernel passes populate `src/index.js` with experimental exports backed by tests.

## Blockers carried forward

- Kernel exports are not implemented until later passes.
- Package contents are not cleaned until the hygiene pass.
