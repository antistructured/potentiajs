# File Routing Public Conventions Decision

## Files inspected

- `src/dev/file-routing/path-mapping.js`
- `src/dev/file-routing/scanner.js`
- `src/dev/file-routing/generator.js`
- `tests/file-routing-path-mapping.test.js`
- `tests/file-routing-scanner.test.js`
- `tests/file-routing-generator.test.js`
- prior file-routing internal reports

## Initial public conventions

The first public file-routing API should keep the current convention set.

### Route files

Supported initially:

| File | Route path |
| --- | --- |
| `routes/index.js` | `/` |
| `routes/users/index.js` | `/users` |
| `routes/users/[id].js` | `/users/:id` |
| `routes/users/profile.js` | `/users/profile` |
| nested folders | nested path segments |

### Private files and folders

Supported initially:

- `_`-prefixed files are ignored/private
- `_`-prefixed folders are ignored/private
- `_routes.js` is the only `_` file with special meaning

Private files are ignored by the scanner and must not become routes.

### Extensions

Supported initially:

- `.js` ESM route modules only

Deferred:

- `.mjs`
- `.ts`
- `.tsx`
- `.jsx`
- framework-specific page/component files

Reason: PotentiaJS currently remains plain JavaScript ESM with no build step requirement. TypeScript route files imply transpilation/config resolution that belongs in a later compiler/tooling block.

## Route module exports

Supported initial route module shapes:

```js
export default route('GET', '/', handler);
```

```js
export default createRoutes({
  routes: [
    route('GET', '/', handler)
  ]
});
```

The key rule: route modules export explicit Potentia route primitives. The file router projects files into composition; it does not invent handlers or hidden route behavior.

## Folder metadata convention

Public folder metadata file:

```txt
_routes.js
```

Supported initial shape:

```js
export default createRoutes({
  hooks,
  contracts,
  meta,
  routes: []
});
```

Public meaning:

- contributes scoped hooks
- contributes scoped contracts
- contributes scoped metadata
- does not create a route by itself
- generated output attaches discovered child routes/folders

Initial restriction:

- `_routes.js` should not manually define child routes that duplicate discovered children in the same folder. If a future implementation permits this, it must define ordering/collision semantics first.

## Deferred route module exports

Deferred:

```js
export const GET = ...
export const POST = ...
export const meta = ...
export const loader = ...
export const action = ...
```

Reasons:

- named method exports imply framework-owned route construction
- loader/action exports imply frontend/full-stack semantics not yet designed
- named metadata exports create merging rules separate from `createRoutes(...)`
- current explicit primitives are already enough

## Deferred path conventions

Deferred intentionally:

- catch-all routes: `[...slug]`
- optional params: `[[id]]`
- route groups: `(marketing)`
- method-specific files: `users.get.js`, `users.post.js`
- layout files: `_layout.js`, `layout.js`
- page files: `page.js`, `+page.js`, etc.
- frontend loader/action conventions
- lazy route modules
- async route module loading

Unsupported conventions should fail closed if they look like route syntax, not silently create surprising routes.

## Route path override policy

Initial public convention should avoid path-prefix overrides in `_routes.js`.

Reason: filesystem path is the projection source. Allowing folder metadata to override the path prefix undermines predictability and creates collision/order complexity.

If path overrides are ever allowed, they need a separate design gate.

## Decision

Keep the current convention set for first public design:

- explicit `.js` route modules
- default exports of `route(...)` or `createRoutes(...)`
- `_routes.js` for scoped metadata
- no named method exports yet
- no TypeScript route files yet
- no catch-all/optional/groups yet

## Blockers

No design blocker remains.

## Publish status

No publish command was run.
