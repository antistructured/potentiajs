# File Routing Minimal CLI Docs Update

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-docs-example-decision.md`

## Files changed

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-minimal-cli-docs-update.md`

## README updates

README now documents the implemented experimental CLI:

```bash
potentia routes generate
```

It also shows the equivalent explicit form:

```bash
potentia routes generate --root routes --out .potentia/routes.generated.js --package @potentiajs/core
```

The programmatic API remains documented as a first-class fallback:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

README explicitly states:

- CLI currently only supports `routes generate`
- no watch mode
- no config files
- no dev server
- no compiler
- no production runtime filesystem scanning
- generated output remains explicit route composition

## Example docs updates

`examples/file-routing-basic/README.md` now shows CLI generation first:

```bash
potentia routes generate \
  --root examples/file-routing-basic/routes \
  --out examples/file-routing-basic/.potentia/routes.generated.js
```

It keeps the programmatic `generate.js` script documented.

## Unsupported claims avoided

Docs do not claim:

- `potentia dev`
- `potentia build`
- `potentia routes watch`
- config files
- TypeScript route files
- catch-all / optional / route-group support
- frontend/runtime/client SDK/OpenAPI behavior

## Blockers

None.

## Publish status

No publish command was run.
