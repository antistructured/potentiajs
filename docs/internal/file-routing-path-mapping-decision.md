# File Routing Path Mapping Decision

## Files inspected

- `README.md`
- `src/kernel/route.js`
- `src/kernel/route-collection.js`
- `tests/kernel-dynamic-routes.test.js`
- `tests/kernel-route-mounting.test.js`
- `docs/internal/file-routing-scope-lock.md`
- `docs/internal/file-routing-primitive-compatibility-review.md`

## Status

This is a design decision only. No path mapper was implemented.

## Accepted initial conventions

| Filesystem entry | Route path contribution | Decision |
| --- | --- | --- |
| `routes/index.js` | `/` | accepted |
| `routes/users/index.js` | `/users` | accepted |
| `routes/users/profile.js` | `/users/profile` | accepted |
| `routes/users/[id].js` | `/users/:id` | accepted |
| nested folders | nested path segments | accepted |
| files/folders prefixed `_` | ignored/private by default | accepted |
| `.js` extension | ESM route module | accepted |

## Root route

`routes/index.js` maps to `/`.

Only one root route module may claim `/` for the same method. Collisions fail projection.

## Index routes

`index.js` maps to the containing folder path:

```txt
routes/index.js       → /
routes/users/index.js → /users
routes/api/index.js   → /api
```

`index.js` does not add an `index` URL segment.

## Nested folders

Folders map directly to URL segments:

```txt
routes/api/users/index.js → /api/users
routes/api/users/[id].js  → /api/users/:id
```

Generated output should project folders into nested `createRoutes({ prefix })` collections or equivalent explicit mounts.

## Dynamic params

Bracket dynamic segments are accepted:

```txt
[id].js → :id
[slug].js → :slug
```

Rules:

- param names must be non-empty
- param names should use simple identifier-style names initially: letters, numbers, `_`, `-`
- duplicate param names in one route path should fail projection
- dynamic params map to existing `:param` route syntax

## Ignored/private files

Files and folders prefixed with `_` are ignored by default, except the explicitly reserved `_routes.js` folder metadata file decided separately.

Examples:

```txt
routes/_helpers.js      → ignored
routes/users/_schema.js → ignored
routes/_drafts/test.js  → ignored subtree
```

## Extension support

Accepted initially:

- `.js` ESM files only

Deferred:

- `.mjs`
- `.cjs`
- `.ts`
- `.jsx`
- `.tsx`
- `.view`

Reason: preserve plain JavaScript ESM and avoid build/compiler assumptions.

## API route folders

`api` is not special. It is a normal segment:

```txt
routes/api/users/index.js → /api/users
```

No hidden API/runtime distinction is introduced.

## Method-specific filenames

Deferred.

Rejected for first implementation:

```txt
users.get.js
users.post.js
GET.users.js
```

Reason: method information should initially stay in explicit `route('GET', ...)` module exports. Filename method magic can be revisited after route module conventions are proven.

## Multiple methods per file

Accepted only when the module default export is an explicit `createRoutes(...)` containing multiple `route(...)` entries.

Named method exports such as `export function GET()` are deferred.

## Catch-all routes

Deferred.

Candidate syntax for later:

```txt
[...rest].js → /users/* or /users/:rest*
```

Reason: current route matcher only supports static and single-segment dynamic params. Catch-all would require matcher semantics and specificity decisions.

## Optional params

Deferred.

Candidate syntax for later:

```txt
[[id]].js
```

Reason: optional segments imply multiple effective route paths or matcher expansion and should not be added during the first implementation.

## Route groups

Deferred.

Candidate syntax for later:

```txt
(admin)/users.js → /users with group metadata
```

Reason: route groups can be useful for metadata/layout concepts, but layout/frontend semantics are explicitly out of scope.

## Trailing slash behavior

Use existing kernel normalization and matching behavior:

- `/users` and `/users/` normalize through path segment splitting for matching.
- generated route paths should prefer no trailing slash except root `/`.
- duplicate slashes should not be emitted by the generator.

## Collision behavior

Projection must fail closed on collisions.

Collision examples:

- two files produce the same route path and method
- `users.js` and `users/index.js` both export `GET /users`
- duplicate dynamic names in one path
- path mapping creates an unsupported empty segment
- two generated static routes conflict exactly

Collision diagnostics should include source file paths, route path, and method without reading request bodies or unsafe runtime values.

## Specificity behavior

Projection should preserve existing runtime specificity:

- static routes beat dynamic routes
- declaration/order tie-breaker remains deterministic
- generated order should be stable, ideally lexical by path with explicit specificity sorting only if needed before route construction

Do not add a second hidden specificity model in the projector.

## Deferred conventions

- catch-all segments
- optional params
- route groups
- method-specific filename magic
- named method exports
- non-JS extensions
- frontend/page/layout conventions

## Blockers

- No mapper exists yet.
- Catch-all and optional params require matcher design before implementation.
- Route groups require a metadata/layout boundary decision later.
