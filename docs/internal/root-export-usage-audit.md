# Root Export Usage Audit

## Files inspected

- `src/index.js`
- `README.md`
- `examples/`
- `tests/`
- `src/`
- `docs/internal/public-preview-api-classification.md`

## Files changed

- `docs/internal/root-export-usage-audit.md`

## Usage map

| Export | Category before pruning | README | Examples | Tests | Internal code | Decision candidate |
| --- | --- | --- | --- | --- | --- | --- |
| `createApp` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `route` | preview-core | yes | yes | yes | yes | keep-root-preview |
| `createRoutes` | preview-core | yes | yes | yes | yes | keep-root-preview |
| `mount` | preview-core | yes | yes | yes | dev generator import string | keep-root-preview |
| `action` | preview-core | yes | yes | yes | yes | keep-root-preview |
| `ok` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `fail` | preview-core | yes | yes | yes | yes | keep-root-preview |
| `json` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `text` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `redirect` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `effect` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `call` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `value` | preview-core | yes | no direct example import | yes | root export only | keep-root-preview |
| `context` | preview-core | yes | no direct example import | yes | root export only | keep-root-preview |
| `createFormState` | preview-core | yes | yes | yes | root export only | keep-root-preview |
| `composeRoutes` | preview-advanced | yes | no | no direct root tests | yes | keep-root-preview, advanced |
| `createPlugin` | preview-advanced | yes | yes | yes | root export only | keep-root-preview, advanced/early |
| `projectContract` | preview-projection | yes | no | yes | yes | keep-root-preview, projection |
| `projectRoute` | preview-projection | yes | no | yes | root export only | keep-root-preview, projection |
| `projectRoutes` | preview-projection | yes | no | yes | yes | keep-root-preview, projection |
| `projectAction` | preview-projection | yes | no | yes | yes | keep-root-preview, projection |
| `projectForm` | preview-projection | yes | yes | yes | root export only | keep-root-preview, projection |
| `createRouteManifest` | preview-projection | yes | no | yes | root export only | keep-root-preview, projection |
| `createFrameworkError` | preview-diagnostic | yes | yes | yes | yes | keep-root-preview, diagnostic |
| `createRequestContext` | preview-internal-candidate | API status only | no | yes, one root test | yes | remove-root-before-preview |
| `runEffect` | preview-internal-candidate | API status only | no | yes, effect tests | yes | remove-root-before-preview |
| `normalizeFrameworkError` | preview-internal-candidate | API status only | no | yes, one root test | yes | remove-root-before-preview |
| `toResponse` | preview-internal-candidate | API status only | no | yes, one root test | yes | remove-root-before-preview |

## Exports that appear only in tests or API-status docs

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

These are not used by shipped examples or README tutorial code.

## Exports used by public examples

- `action`
- `call`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `ok`
- `projectForm`
- `redirect`
- `route`
- `text`

## Exports used in README tutorial/example code

Core README examples use only the intended preview surface. Internal candidates appear in the public API status section, not tutorial paths.

## Exports not used outside source/tests

- `composeRoutes` is documented but not used by examples. It is still part of the explicit composition architecture and is used internally.
- Most projection APIs are documented and tested but not example-imported except `projectForm`.

## Likely accidental root exports

The likely accidental/overexposed exports are:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

They are implementation/test affordances rather than app-author preview APIs.

## Required public-preview example dependencies

Public examples require keeping:

- app/route/composition APIs
- result/response helpers
- action APIs
- effect descriptor/helpers
- form state/projection APIs
- plugin seam
- diagnostic error constructor

## Risks

Removing internal candidates requires updating tests to import directly from internal modules. This is acceptable because source implementation remains present and package behavior does not change.

## Blockers

No blocker. Usage evidence supports pruning the internal candidates from root before preview.
