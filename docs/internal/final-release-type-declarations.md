# Final Release Type Declarations

## Files inspected

- `src/index.js`
- `package.json`
- `docs/internal/owner-jsr-types-decision.md`
- root `*.d.ts` search

## Files changed

- `src/index.d.ts`
- `package.json`
- `docs/internal/final-release-type-declarations.md`

## Decision

Implemented minimal conservative handwritten declarations now.

Rationale:

- Owner direction preferred the best public-preview posture.
- npm users benefit from editor/type discovery.
- future JSR compatibility benefits from an explicit type story.
- source remains plain JavaScript ESM.
- no build step or TypeScript source conversion was introduced.

## Declaration coverage

`src/index.d.ts` covers the exact root export set:

- `action`
- `call`
- `composeRoutes`
- `context`
- `createApp`
- `createFormState`
- `createFrameworkError`
- `createPlugin`
- `createRouteManifest`
- `createRoutes`
- `effect`
- `fail`
- `json`
- `mount`
- `ok`
- `projectAction`
- `projectContract`
- `projectForm`
- `projectRoute`
- `projectRoutes`
- `redirect`
- `route`
- `text`
- `value`

Removed internal helpers are not declared:

- `createRequestContext`
- `runEffect`
- `normalizeFrameworkError`
- `toResponse`

## Package metadata

Added:

```json
"types": "./src/index.d.ts"
```

Changed root export metadata to include:

```json
"exports": {
  ".": {
    "types": "./src/index.d.ts",
    "import": "./src/index.js"
  }
}
```

Included declaration and changelog in package files:

- `src/index.d.ts`
- `CHANGELOG.md`

## Type posture

Declarations are intentionally broad and conservative:

- `unknown` for contract/projection internals
- minimal route/app/action/result descriptor interfaces
- no deep generic inference promises
- no stable API promise

## Optional typecheck

No TypeScript dependency or typecheck tool exists in the project, and this block must not add dev dependencies. Type smoke validation is therefore deferred unless a future block explicitly adds a dev-only typecheck tool.

## Blockers

No declaration blocker remains for npm preview.

JSR still needs a compatibility design gate before JSR publish readiness.

## Publish status

Real publish was not run.
