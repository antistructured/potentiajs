# SigilJS Contract Integration Audit

## Scope

This pass determines how SigilJS should serve as the framework's contract-first data boundary layer. It does not add SigilJS as a dependency and does not implement contract APIs.

## Files inspected

- `package.json`
- `bun.lock`
- `src/index.mjs`
- `cli/index.mjs`
- `cli/dev.mjs`
- `plugins/dsl-ui.mjs`
- `reactive.mjs`
- `ui.mjs`
- `examples/UserProfile.view`
- `potentia.config.mjs`
- `README.md`
- `docs/internal/framework-inventory-audit.md`
- `docs/internal/framework-architecture-boundary-audit.md`
- `docs/internal/framework-public-surface-classification.md`

## Current SigilJS usage

- No current source file imports or references SigilJS.
- No contract, schema, validation, or boundary module exists.
- `package.json` has no runtime dependencies, dev dependencies, or peer dependency on SigilJS.
- `bun.lock` does not list SigilJS.

## Required contract boundary map

| Boundary | Current state | SigilJS role later | Priority |
| --- | --- | --- | --- |
| Route params | Router deferred | Validate named params before handler execution. | high |
| Query params | Router/request normalization deferred | Parse/coerce/validate query object at route boundary. | high |
| Request bodies | Server currently hard-coded HTML only | Validate JSON/form/body payloads before effects. | high |
| Response bodies | Server returns static HTML response | Validate handler output before serialization. | high |
| Form submissions | No form runtime | Validate browser/server form payloads; project constraints to UI later. | medium |
| Config files | Empty `potentia.config.mjs`; no loader | Validate config module shape and defaults. | medium |
| Environment variables | No env handling | Validate env once in server/bootstrap shell. | medium |
| Database records | No database layer | Validate records at repository/adapter boundary later; no ORM helper yet. | low/medium |
| Server actions/functions | Not implemented | Validate action input/output and stable result/error envelopes. | high after route kernel |
| RPC/action calls | Not implemented | Share contract projection between client/server calls. | medium |
| AI/LLM output | Not implemented | Use SigilJS directly to validate model output received by app code; no provider-specific helper. | low until AI surface exists |
| CLI input/output | CLI prototype only | Validate command args/options and machine-readable output shapes. | medium |

## Recommended integration strategy

1. Start with the server/kernel boundary only.
2. Introduce contract slots on route declarations: `params`, `query`, `body`, and `response`.
3. Keep SigilJS validation at app boundaries, not deep inside handlers.
4. Normalize incoming request data before contract validation.
5. Return stable result/error shapes from the framework kernel.
6. Delay frontend/form projection until server request/response contracts are proven.
7. Delay database, AI, and package extraction until the kernel has route/action evidence.

## Dependency posture recommendation

Recommended for the next kernel block:

- Use SigilJS as a **peer dependency plus dev dependency** if `potentia-js` is intended to be a separate framework package consumed by apps.
- Use a **workspace/local dependency** only if this repository becomes a monorepo with SigilJS included.
- Avoid bundling or hiding SigilJS as an opaque runtime dependency if contracts are part of the public extension model.
- Do not add the dependency during this audit block.

Rationale:

- Application authors should control the SigilJS version used for their boundary contracts.
- Framework APIs can accept SigilJS contract-like values without forcing a package split immediately.
- Peer + dev posture keeps runtime dependency posture explicit while supporting tests/examples.

## Contract projection opportunities

SigilJS contract projection can later power:

- Request/response runtime guards.
- Generated API docs from route contracts.
- Example payload generation via structural mock/cases once integrated.
- Contract tests for route handlers.
- CLI input/output validation docs.
- Form constraints after frontend/form surfaces exist.

## Highest-priority contract surfaces

For the next build block, highest priority should be:

1. Route params.
2. Query params.
3. Request body.
4. Response body.
5. Stable handler result/error shape.
6. Bun request adapter normalization.

These are enough to prove contract-first full-stack boundaries without introducing frontend complexity.

## Non-goals for immediate integration

- No database helper.
- No AI provider helper.
- No frontend form projection as first step.
- No package split.
- No TypeScript source conversion.
- No runtime dependency addition during this audit.

## Pass 4 decisions

- SigilJS is integration-ready conceptually but not wired into this repository.
- The first SigilJS integration should be route/request/response contracts in the smallest Bun-native framework kernel.
- Contract projection should be designed to feed docs and tests after behavior exists, not before.
