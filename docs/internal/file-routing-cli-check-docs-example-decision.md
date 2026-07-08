# File Routing CLI Check Docs / Example Future Update Decision

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `docs/internal/file-routing-cli-check-command-shape-decision.md`
- `docs/internal/file-routing-cli-check-output-exit-decision.md`

## Decision

After check mode is implemented, public docs should show both generation and verification:

```bash
potentia routes generate
potentia routes check
```

Docs should preserve the core split:

```txt
generate writes. check verifies.
```

## README future order

Recommended README file-routing docs order after implementation:

1. Generate routes with CLI
2. Use generated routes explicitly with `createApp(...)`
3. Check generated output in CI
4. Programmatic API fallback with `generateFileRoutes(...)`
5. Deferred boundaries: no watch/config/dev server/compiler/runtime scanning

## README future CI example

Future README can include:

```bash
potentia routes check
```

And optionally project-local scripts as an example for application users:

```json
{
  "scripts": {
    "routes:generate": "potentia routes generate",
    "routes:check": "potentia routes check"
  }
}
```

Do not add those scripts to this framework package root just for documentation/example purposes unless a later implementation block has a concrete need.

## Example README future update

After implementation, update `examples/file-routing-basic/README.md` to include:

```bash
potentia routes check \
  --root examples/file-routing-basic/routes \
  --out examples/file-routing-basic/.potentia/routes.generated.js
```

Place it after generation and before local app running.

## Programmatic API remains first-class

Do not remove:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

The CLI remains a convenience wrapper. Programmatic generation remains useful for custom scripts, monorepos, and build-tool integration.

## Docs must not claim before implementation

This design block must not update README/example docs to claim `potentia routes check` exists.

Only future implementation docs should add public check-mode usage.

## Still deferred in future docs

Even after check mode implementation, docs should continue to say Potentia does not include:

- watch mode
- config files
- dev server
- compiler
- runtime request-time filesystem scanning
- route convention expansion
- JSON output, until implemented

## Blockers

None.

## Implementation status

No implementation was added.

## Publish status

No publish command was run.
