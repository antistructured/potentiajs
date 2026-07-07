# File Routing Public Docs / Example Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified package/root/subpath boundaries.

No publish commands were run.

## Results

### Tests

```txt
565 pass
0 fail
1221 expect() calls
```

### Release check

```txt
565 pass
0 fail
1221 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 55
examples/file-routing-basic/: included
examples/file-routing-dev/: excluded
.potentia/: excluded
docs/internal/: excluded
```

## Invariants

Verified:

- root exports unchanged
- `@potentiajs/core/file-routing` subpath unchanged
- subpath still exports `generateFileRoutes` from the writer
- no CLI/bin added
- no watch/compiler added
- no runtime filesystem scanning added
- no dev dependencies added
- package name unchanged: `@potentiajs/core`
- version unchanged: `0.1.0-preview.0`
- generated output not left in `examples/file-routing-basic/.potentia/`

## Example state

Public example:

```txt
examples/file-routing-basic/
```

Routes:

- `/`
- `/health`
- `/users/:id`

Generation:

```bash
bun examples/file-routing-basic/generate.js
```

The example uses:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

## Package decision

Ship:

```txt
examples/file-routing-basic/
```

Keep repo-only:

```txt
examples/file-routing-dev/
```

## Remaining blockers

None for this docs/example block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Publish status

Real publish was not run.
