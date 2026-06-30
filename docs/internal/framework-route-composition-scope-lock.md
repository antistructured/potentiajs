# Framework Route Composition Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/app.js`
- `src/kernel/route.js`
- `src/kernel/context.js`
- `src/kernel/contract.js`
- `tests/`
- `examples/kernel-basic/`
- `examples/sigiljs-basic/`
- `docs/internal/framework-kernel-hardening-report.md`
- `docs/internal/framework-sigiljs-native-integration-report.md`
- `docs/internal/framework-router-context-model.md`
- `docs/internal/framework-lifecycle-hooks.md`
- `docs/internal/framework-sigiljs-native-contracts.md`

## Current route shape

`route(method, path, handler, options)` returns a deterministic route object:

- `method`
- `path`
- `handler`
- `options`
- `pattern`

`pattern` is the parsed route path used by `matchRoute()`.

## Current app route ingestion

`createApp({ routes })` currently accepts a flat array of direct route objects and shallow-copies it. No route collections, mounts, plugins, or registry exist.

## Current hook structure

App hooks are configured as:

- `beforeRequest`
- `afterResponse`
- `onError`

Hooks are normalized into arrays and currently apply globally.

## Current contract option shape

Route options currently support contract boundaries:

- `params`
- `query`
- `headers`
- `body`
- `response`

Contract styles supported:

- generic function
- `{ parse(value) }`
- `{ check(value) }`
- native SigilJS contracts

## Route collection normalization location

Route composition should live in a new kernel module:

- `src/kernel/route-collection.js`

`createApp()` should call collection normalization before request handling so the router continues to receive a flat route table.

## Public API decisions

Add experimental exports if implemented:

- `createRoutes`
- `mount`
- `composeRoutes`

Optional:

- `createPlugin`, only if the plugin seam stays small and explicit.

Keep router internals private:

- no matcher/compiler exports
- no global route registry
- no filesystem magic

## Scope decisions

In scope:

- explicit route collections
- deterministic flattening
- deterministic prefix/mount composition
- scoped contract defaults
- scoped lifecycle hooks
- small plugin seam if implemented explicitly
- composed example and docs

Deferred:

- file routing
- route auto-discovery
- nested layout routing
- frontend rendering or hydration
- client routing
- compiler changes
- CLI scaffolding
- database/auth layers
- dependency injection container
- full plugin ecosystem
- async plugin loading/discovery
- package splitting
- CI/release automation
- public API stabilization

## Acceptance posture

This block may add explicit composition primitives only. It must not introduce framework magic, file-system conventions, hidden registries, or broad plugin behavior.
