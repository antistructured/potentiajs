# File Routing CLI Docs / Example Future Decision

## Files inspected

- `README.md`
- `examples/file-routing-basic/README.md`
- `examples/file-routing-basic/generate.js`
- `docs/internal/file-routing-public-docs-example-report.md`
- `docs/internal/file-routing-cli-config-watch-decision.md`

## Current docs posture

Current public docs correctly show the programmatic API:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

README and the example also correctly state that no public CLI exists yet.

Do not change that wording until a CLI is implemented.

## Future docs decision after CLI implementation

When `potentia routes generate` exists, update docs in this order:

1. CLI quickstart
2. Programmatic API fallback
3. Generated output explanation

Recommended future README shape:

```md
Generate routes with the CLI:

```bash
potentia routes generate
```

Or call the API directly:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```
```

The programmatic API remains first-class because it supports:

- custom build scripts
- monorepo workflows
- tests
- package/fork aliases
- generated output smoke tests

## Example decision

Keep:

```txt
examples/file-routing-basic/generate.js
```

Even after CLI implementation.

Reason:

- it demonstrates the public API directly
- it is useful in tests
- it provides a no-CLI fallback
- it keeps file routing understandable as a thin wrapper around `generateFileRoutes(...)`

After CLI implementation, update `examples/file-routing-basic/README.md` to show both:

```bash
potentia routes generate --root examples/file-routing-basic/routes --out examples/file-routing-basic/.potentia/routes.generated.js
```

and:

```bash
bun examples/file-routing-basic/generate.js
```

The CLI command should be presented as the convenient path, not as a different routing system.

## Documentation constraints

Future CLI docs must state:

- CLI is dev/build-time generation
- CLI wraps `generateFileRoutes(...)`
- generated output is explicit route composition
- app code still imports generated routes and calls `createApp(...)`
- no runtime filesystem scanning
- no root export change
- no watch mode unless implemented later
- no config file unless implemented later

## README now

Do not update README in this design gate to claim CLI availability.

The current README statement remains accurate:

```txt
There is no public CLI yet; watch/compiler integration remains deferred.
```

## Deferred docs

Defer until implementation:

- CLI quickstart in README
- package `bin` docs
- `bunx`/`npm exec` invocation examples
- CLI output screenshots/examples from real execution
- CLI troubleshooting docs

## Blockers

None.

## Implementation status

No implementation was added.

No README CLI claim was added.

## Publish status

No publish command was run.
