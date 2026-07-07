# File Routing Default Package Identity Update

## Files inspected

- `src/dev/file-routing/generator.js`
- `src/dev/file-routing/writer.js`
- `scripts/generate-file-routes.js`
- `tests/file-routing-generator.test.js`
- `tests/file-routing-writer.test.js`
- `tests/file-routing-generated-smoke.test.js`
- `tests/file-routing-script.test.js`
- `tests/file-routing-dev-example.test.js`
- `examples/file-routing-dev/`

## Files changed

- `docs/internal/file-routing-default-package-identity-update.md`

No source behavior change was needed in this pass because current local source already reflects the post-release/design-gate identity fixes.

## Identity state

Default generated import package is already:

```txt
@potentiajs/core
```

Confirmed in:

- `src/dev/file-routing/generator.js`
- `scripts/generate-file-routes.js`
- file-routing tests

## Override behavior

Existing writer test proves `packageName` override still works:

```js
generateFileRoutes({
  rootDir,
  outputFile,
  packageName: '@internal/potentia'
});
```

Expected generated import:

```js
import { createRoutes, mount } from '@internal/potentia';
```

## Stale package-name risk

No stale `potentia-js` or `potentiajs` references were found in the file-routing implementation path inspected for this pass.

Historical internal docs still mention old names, but those are historical records and are not part of current generated output behavior.

## Tests proving behavior

Existing tests already assert:

- default generated import from `@potentiajs/core`
- internal script default package is `@potentiajs/core`
- generated smoke self-import symlink uses `@potentiajs/core`
- package override is respected

Additional public subpath tests are added in a later pass.

## Blockers

None.

## Publish status

No publish command was run.
