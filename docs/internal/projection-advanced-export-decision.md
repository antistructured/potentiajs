# Projection / Advanced Export Decision

## Files inspected

- `src/index.js`
- `README.md`
- `docs/internal/root-export-usage-audit.md`
- `docs/internal/internal-candidate-export-decision.md`
- `docs/internal/public-preview-api-classification.md`
- projection tests and examples

## Files changed

- `docs/internal/projection-advanced-export-decision.md`

## Projection API decision

Decision: `keep-root-preview`.

Projection APIs staying as experimental root exports:

- `projectContract`
- `projectRoute`
- `projectRoutes`
- `projectAction`
- `projectForm`
- `createRouteManifest`

Reason:

- metadata/projection is a core identity of Potentia
- projection APIs obey the projection law: static metadata only, no handler/hook/generic contract execution
- `projectForm(...)`, action projection, route projection, and manifests are part of the framework's differentiator
- they are already documented as experimental and not generators

Constraints:

- no OpenAPI/client/docs/form generator promise
- no schema stability promise
- no manifest file writer/loader promise
- no frontend/runtime implication

## Advanced API decision

### `composeRoutes`

Decision: `keep-root-preview`.

Reason: explicit route composition is core architecture. Even if app authors usually use `createRoutes(...)` and `mount(...)`, keeping `composeRoutes(...)` gives advanced/tooling users a transparent flattening primitive.

### `createPlugin`

Decision: `keep-root-preview`.

Reason: the plugin seam exists and is useful for composition examples. It remains advanced/early. Docs must avoid marketplace/ecosystem/discovery claims.

### `createFrameworkError`

Decision: `keep-root-preview`.

Reason: userland handlers/hooks may need to create framework-shaped exposed errors intentionally. Lower-level normalization is internalized, but the constructor remains a useful diagnostic/advanced public helper.

## Exports changed

None in this pass. Root export pruning happened in Pass 3 only.

## Blockers

No blocker. Projection and advanced APIs are intentionally retained as experimental public preview surface.
