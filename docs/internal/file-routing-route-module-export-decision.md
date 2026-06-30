# File Routing Route Module Export Decision

## Files inspected

- `src/index.js`
- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `src/kernel/plugin.js`
- `examples/kernel-basic/index.js`
- `examples/sigiljs-basic/index.js`
- `examples/composed-basic/index.js`
- `docs/internal/file-routing-path-mapping-decision.md`

## Status

This is a design decision only. No route module loader or export adapter was implemented.

## Accepted initial route module shapes

A file route module may default-export exactly one explicit Potentia route descriptor:

```js
export default route('GET', '/users/:id', handler, {
  params: Params,
  response: Response
});
```

A file route module may default-export one explicit route collection:

```js
export default createRoutes({
  routes: [
    route('GET', '/', listUsers),
    route('POST', '/', createUser)
  ]
});
```

## Core decision

Initial file routing should support only explicit default exports:

- `export default route(...)`
- `export default createRoutes(...)`

Reason:

- aligns with existing kernel primitives
- keeps contract definitions near explicit `route(...)` calls
- avoids method-name magic
- keeps modules independently testable
- keeps generated output simple imports plus `createRoutes(...)`
- avoids new public exports

## Path consistency rule

For `export default route(...)`, the route path should either:

1. match the filesystem-derived path exactly, or
2. be `/` and be mounted under the filesystem-derived parent path by generated output.

Recommended first implementation posture:

- allow explicit route paths
- validate that explicit route path does not conflict with filesystem projection
- fail closed on ambiguous mismatches

This preserves explicitness while allowing future design room.

## Named method exports

Deferred:

```js
export function GET(ctx) {}
export function POST(ctx) {}
export const contracts = {};
export const hooks = {};
```

Reason:

- convenient but more magical
- requires converting handlers/options into `route(...)` descriptors
- introduces questions about route path source of truth
- increases docs and diagnostics complexity

Future candidate if implemented later:

```js
export const params = Params;
export const response = Response;
export function GET(ctx) {
  return ok(json({ id: ctx.params.id }));
}
```

But this should be a later ergonomic layer over the explicit route model, not the first design implementation.

## Named metadata exports

Deferred for route modules:

- `contracts`
- `hooks`
- `meta`

Reason: folder metadata has a clearer home in `_routes.js`; per-route metadata should stay inside explicit `route(..., options)` for the first implementation.

## Exported `routes`

Deferred.

Do not initially support:

```js
export const routes = [];
```

Reason: default `createRoutes(...)` is clearer and maps directly to the kernel primitive.

## Exported `plugin`

Deferred.

Do not auto-discover plugin exports from file routes.

Reason: plugin loading/discovery remains explicitly out of scope and should not be coupled to file routing.

## Lazy or async loading

Deferred.

Initial projection should generate static ESM imports. Lazy loading can be revisited after route module conventions are stable.

## Unsupported initial patterns

- multiple route exports from one file unless wrapped in default `createRoutes(...)`
- named method exports
- default plain handler function
- default object config that is not `route(...)`/`createRoutes(...)`
- async module discovery at request time
- plugin auto-discovery
- TypeScript route modules

## Future design candidates

- named method handlers
- route-level `meta`
- source metadata in generated manifests
- lazy route boundaries
- generated docs from route modules
- frontend/server export separation

## Blockers

- No route module loader exists.
- No source metadata primitive exists yet.
- No collision diagnostics exist yet.
- No implementation was added.
