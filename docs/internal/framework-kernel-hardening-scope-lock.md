# Framework Kernel Hardening Scope Lock

## Goal

Harden the experimental `potentia-js` kernel without expanding into frontend, CLI, compiler, database, auth, package splitting, TypeScript, or release automation.

All APIs remain **experimental**. No stable API is declared in this block.

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/context.js`
- `src/kernel/contract.js`
- `src/kernel/effect.js`
- `src/kernel/result.js`
- `src/kernel/response.js`
- `src/kernel/route.js`
- `tests/`
- `docs/internal/framework-kernel-foundation-report.md`
- `docs/internal/framework-router-context-model.md`
- `docs/internal/framework-contract-boundary-model.md`
- `docs/internal/framework-effect-model.md`
- `docs/internal/framework-result-response-model.md`

## Current exported API

Current experimental public exports:

- `createApp`
- `createRequestContext`
- `effect`
- `fail`
- `json`
- `ok`
- `redirect`
- `route`
- `runEffect`
- `text`
- `toResponse`

New public exports allowed in this hardening block:

- `createFrameworkError`
- `normalizeFrameworkError`

Keep route internals (`matchRoute`, pattern parsing) internal unless an implementation constraint makes exposure necessary.

## Current internal modules

- `src/kernel/app.js` owns request dispatch, matching, contract application, handler/effect execution, response contract application, and conversion to native `Response`.
- `src/kernel/route.js` owns route descriptors and route matching.
- `src/kernel/context.js` owns request context construction.
- `src/kernel/contract.js` owns contract adapter behavior.
- `src/kernel/effect.js` owns effect descriptors and interpretation.
- `src/kernel/result.js` owns `ok`/`fail` result shapes and current error normalization.
- `src/kernel/response.js` owns response descriptors, body extraction/replacement, and native response projection.

## Current route shape

Routes currently initialize stable keys:

```js
{ method, path, handler, options }
```

Hardening may add internal precomputed route metadata as long as route objects remain shape-stable and public route behavior remains experimental.

## Current context shape

Context currently initializes:

```js
{ request, method, url, path, params, query, headers, body, route, state }
```

Hardening decisions:

- `params` becomes the decoded dynamic route params object.
- `query` becomes a plain deterministic object instead of `URLSearchParams` once query contract work lands.
- `headers` becomes a plain deterministic lowercase-key object once header contract work lands.
- `body` remains `null` unless a body contract exists and validates.

## Contract application points

Current contract points:

- body contract before handler
- response contract after handler/effect execution, before native `Response` conversion

Hardening adds:

- query contract before handler
- headers contract before handler

Contract failures should normalize through typed framework errors once Pass 4 lands.

## Response conversion semantics

Current `toResponse(...)` handles native `Response`, response descriptors, `ok`, `fail`, `Error`, `undefined`, and plain objects. Pass 5 will formalize projection order and add string/null semantics tests.

Response contracts should validate logical handler output before final native response where practical. Native `Response` passthrough should not be contract-validated unless explicitly documented later.

## Route params location

Dynamic route params belong in `src/kernel/route.js`:

- pattern parsing
- segment matching
- URL decoding
- route specificity scoring

Decoded params are stored on `match.params`, then copied into `ctx.params` by `createRequestContext(...)`.

## Framework errors location

Typed framework errors belong in a new `src/kernel/error.js` module. Result and response helpers should delegate error normalization to it.

Required public typed error helpers:

- `createFrameworkError(code, message, options)`
- `normalizeFrameworkError(error)`

## Hooks location

App lifecycle hooks belong in `src/kernel/app.js` and should reuse `runEffect(...)` from `src/kernel/effect.js`.

Hook phases in scope:

- `beforeRequest`
- `afterResponse`
- `onError`

No full middleware/plugin system is in scope.

## Deferred work

- frontend rendering/hydration/client routing
- file-based routing
- route groups/nested layouts
- wildcards, optional params, regex params
- server actions/RPC
- database integration
- auth
- full middleware ecosystem
- CLI expansion
- compiler changes
- package splitting
- TypeScript conversion or JSDoc typing layer
- installing SigilJS
- CI/release workflow
- streaming/file responses/content negotiation/cookies API

## Pass 1 decisions

- Preserve the small experimental public API.
- Add only typed framework error helpers as new public exports if needed.
- Keep hardening behavior inside `src/kernel/`.
- Continue strict test-first implementation for each behavior slice.
- No source behavior changes in this pass.
