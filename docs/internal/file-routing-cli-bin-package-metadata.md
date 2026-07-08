# File Routing CLI Bin / Package Metadata

## Files inspected

- `package.json`
- `docs/internal/file-routing-minimal-cli-foundation-scope-lock.md`
- `docs/internal/file-routing-cli-design-gate-report.md`

## Files changed

- `bin/potentia.js`
- `src/cli.js`
- `package.json`
- `docs/internal/file-routing-cli-bin-package-metadata.md`

## Binary

Added:

```txt
bin/potentia.js
```

The binary uses:

```js
#!/usr/bin/env node
```

It imports internal CLI main:

```js
import { main } from '../src/cli.js';
```

It does not:

- start a server
- watch files
- publish
- scan files at request time
- add TypeScript or dependency requirements

## Package metadata

Added package bin metadata:

```json
{
  "bin": {
    "potentia": "./bin/potentia.js"
  }
}
```

Package files now include:

```txt
bin/potentia.js
src/cli.js
```

## Internal CLI module

Created:

```txt
src/cli.js
```

This module is internal and is not root-exported. Parser/generate behavior is completed in later passes.

## Export boundaries

Root exports were not changed.

`@potentiajs/core/file-routing` subpath was not changed.

## Dependencies

No dependencies were added.

## Blockers

None.

## Publish status

No publish command was run.
