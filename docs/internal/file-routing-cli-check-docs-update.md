# File Routing CLI Check Docs Update

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-check-docs-example-decision.md`

## Files changed

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-check-docs-update.md`

## README updates

README now documents both implemented CLI commands:

```bash
potentia routes generate
potentia routes check
```

It explains:

- `generate` writes `.potentia/routes.generated.js`
- `check` verifies generated output is current
- `check` does not write files
- `check` is suitable for CI
- both commands support `--root`, `--out`, `--package`, and `--cwd`
- JSON output is not implemented yet
- watch mode is not implemented
- config files are not implemented
- dev server/compiler behavior is not implemented
- runtime filesystem scanning is not part of the kernel

The programmatic API remains documented:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

## Example README updates

`examples/file-routing-basic/README.md` now includes:

```bash
potentia routes check \
  --root examples/file-routing-basic/routes \
  --out examples/file-routing-basic/.potentia/routes.generated.js
```

It states that `check` verifies generated output without writing or rewriting files.

## Unsupported claims avoided

Docs do not claim:

- `potentia routes generate --check`
- `--json`
- `potentia routes watch`
- config files
- dev server
- compiler integration
- TypeScript route files
- catch-all / optional / route-group support

## Blockers

None.

## Publish status

No publish command was run.
