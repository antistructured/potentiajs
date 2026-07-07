# File Routing README Walkthrough

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-public-docs-example-scope-lock.md`

## Files changed

- `README.md`
- `docs/internal/file-routing-readme-walkthrough.md`

## README updates

The file-routing section now shows the full public flow:

```txt
filesystem → route modules → createRoutes / route / mount → createApp
```

It includes:

- route tree example
- public subpath import
- `generateFileRoutes(...)` example
- generated route module consumption with `createApp(...)`
- link to `examples/file-routing-basic/`

## Explicit statements preserved

README states:

- file routing is a package subpath, not a root export
- generated output is explicit route composition
- runtime apps consume normal route collections
- `.potentia/` is ignored by default and usually not committed
- no production runtime filesystem scanning
- no public CLI yet
- watch/compiler integration remains deferred

## Example list

Added:

```txt
examples/file-routing-basic/ — experimental file-route generation smoke app
```

## Unsupported conventions avoided

README does not imply:

- named `GET` / `POST` exports
- TypeScript route files
- catch-all / optional / group routes
- page/layout/frontend conventions
- runtime filesystem routing
- CLI/watch/compiler support

## Blockers

None.

## Publish status

No publish command was run.
