# Framework SigilJS Native Integration Report

## 1. Current package

- Package: `potentia-js`
- Private: yes
- Runtime: Bun-first plain JavaScript ESM

## 2. Current version

- `0.0.1`

## 3. Dependency decision

Added runtime dependency:

```json
{
  "@weipertda/sigiljs": "0.18.0"
}
```

Decision evidence:

- package identity confirmed with `npm view @weipertda/sigiljs version name exports --json`
- install verified with `bun add @weipertda/sigiljs@0.18.0`
- plain JavaScript ESM import verified with Bun
- contract creation/parsing verified with real API

Real API note: SigilJS `0.18.0` uses JavaScript constructors/helpers such as `sigil({ id: String })` and `optional(String)`, not string shorthand like `{ id: 'string' }`.

## 4. Scope completed

Completed:

- native SigilJS dependency decision
- contract adapter architecture
- params contract boundary
- native SigilJS support for all route contract boundaries
- safe contract diagnostics
- minimal contract projection
- SigilJS smoke example
- README and internal docs updates

Out of scope and not added:

- frontend runtime
- CLI expansion
- compiler changes
- database/auth
- package split
- TypeScript source conversion
- CI/release workflow

## 5. New/changed public exports

Added experimental public export:

- `projectContract`

Preserved experimental exports:

- `createApp`
- `createFrameworkError`
- `createRequestContext`
- `effect`
- `fail`
- `json`
- `normalizeFrameworkError`
- `ok`
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`

No API is stable.

## 6. SigilJS supported boundaries

SigilJS contracts work for:

- `params`
- `query`
- `headers`
- `body`
- `response`

SigilJS request boundary failures return status 400 with `POTENTIA_CONTRACT_FAILED`.

SigilJS response boundary failures return status 500 with `POTENTIA_RESPONSE_CONTRACT_FAILED`.

## 7. Generic contract compatibility

Generic contract styles remain supported:

- function contract
- `{ parse(value) }`
- `{ check(value) }`

The adapter uses one internal path through `normalizeContract()` and `applyContract()`.

## 8. Contract diagnostics

Contract failure bodies now include:

- `code`
- `message`
- `boundary`
- `issues`

Example:

```js
{
  error: {
    code: 'POTENTIA_CONTRACT_FAILED',
    message: 'Params failed contract validation',
    boundary: 'params',
    issues: [{ message: 'Contract validation failed' }]
  }
}
```

Diagnostics intentionally do not expose raw input, SigilJS internals, or thrown generic validator messages.

## 9. Contract projection behavior

`projectContract(contract)` returns:

```js
{
  kind,
  capabilities,
  schema
}
```

Generic contracts project capability metadata only and do not execute user logic.

SigilJS contracts project safe JSON Schema metadata via SigilJS `toJSONSchema()`.

No OpenAPI/JSON Schema/TypeScript/route-docs generator was added.

## 10. Example app

Created `examples/sigiljs-basic/`:

- `examples/sigiljs-basic/package.json`
- `examples/sigiljs-basic/index.js`
- `examples/sigiljs-basic/README.md`

The example demonstrates:

- `createApp`
- dynamic route params
- params contract
- query contract
- body contract
- response contract
- effect handler
- deterministic contract failure
- `Bun.serve({ fetch: app.fetch })`

## 11. Tests added/updated

Added:

- `tests/kernel-contract-adapter.test.js`
- `tests/kernel-params-contracts.test.js`
- `tests/kernel-sigiljs-contracts.test.js`
- `tests/kernel-contract-diagnostics.test.js`
- `tests/kernel-contract-projection.test.js`
- `tests/sigiljs-basic-example.test.js`

Updated existing contract failure tests for safe diagnostics.

## 12. Docs added/updated

Added:

- `docs/internal/sigiljs-dependency-decision.md`
- `docs/internal/framework-contract-adapter-architecture.md`
- `docs/internal/framework-params-contracts.md`
- `docs/internal/framework-sigiljs-native-contracts.md`
- `docs/internal/framework-contract-diagnostics.md`
- `docs/internal/framework-contract-projection.md`
- `docs/internal/framework-sigiljs-native-integration-report.md`

Updated:

- `README.md`
- `package.json`
- `bun.lock`

## 13. Remaining blockers

- No Git repository at this path.
- No CI/release workflow.
- No lint script/dependency by design.
- No field-level verbose issue projection yet.
- No route composition/module system yet.
- No frontend, compiler, CLI expansion, DB, auth, or package split.

## 14. Recommendation

Next block: **Route Composition Foundation — Manual Virtual Sub-Agent Workflow**

Focus on route modules, route collections, app composition, scoped hooks, scoped contract defaults, a small plugin seam, install-style examples, and package hygiene before public preview.
