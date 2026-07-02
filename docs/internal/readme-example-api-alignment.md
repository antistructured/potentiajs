# README / Examples API Alignment

## Files inspected

- `README.md`
- `examples/`
- `tests/*example*.test.js`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `README.md`
- `docs/internal/readme-example-api-alignment.md`

## Alignment changes

README public API status was updated during Pass 3 to match the pruned root export surface:

- removed `toResponse` from the public results/responses list
- removed `runEffect` from the public effects list
- removed `normalizeFrameworkError` from the public errors list
- removed `createRequestContext` from the public contracts/projection/manifest/plugins/context list
- replaced the lower-level export warning with an internal implementation helper note

## Internal candidate exposure check

No removed internal candidate appears in README or example files:

- `createRequestContext`: not in README/examples
- `runEffect`: not in README/examples
- `normalizeFrameworkError`: not in README/examples
- `toResponse`: not in README/examples

Internal tests still cover these helpers through direct internal module imports, which is intentional.

## Examples alignment

Shipped examples import only intended preview root exports:

- app/route APIs
- response/result helpers
- action APIs
- effect descriptor/helper APIs
- form state/projection APIs
- plugin seam
- diagnostic error constructor

No shipped example imports removed root APIs.

## Source-relative import posture

Shipped examples still use source-relative imports in the repository because nested example self-import is not reliable before publish prep. This remains documented in example READMEs. Packed artifact smoke covers installed package root imports separately.

## Projection/advanced status

README labels projection APIs as experimental metadata helpers and clearly says they are not OpenAPI/client/forms/docs generators. `createPlugin` remains presented as a tiny early seam, not an ecosystem/marketplace feature.

## Stable API claims

No stable API claims were introduced. README continues to state the package is experimental and not production-ready.

## Blockers

No alignment blocker. README and examples now match the actual root export surface after pruning.
