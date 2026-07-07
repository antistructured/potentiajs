# File Routing Public API Shape Decision

## Files inspected

- `package.json`
- `README.md`
- `src/dev/file-routing/index.js`
- `src/dev/file-routing/writer.js`
- `scripts/generate-file-routes.js`
- `docs/internal/file-routing-public-api-scope-lock.md`
- prior internal file-routing reports

## Decision

### Root export

No root export.

File routing should not be added to `@potentiajs/core` root exports because:

- root exports are already the framework authoring surface
- file routing is a dev/build projection utility, not runtime kernel behavior
- root exports should remain usable without filesystem/tooling assumptions
- file routing is optional and should not imply a framework-owned app lifecycle

### Public subpath

Design the future public API as a dedicated subpath:

```js
import { generateFileRoutes } from '@potentiajs/core/file-routing';
```

Chosen over `@potentiajs/core/dev` because:

- `file-routing` is explicit and discoverable
- `dev` would become an umbrella namespace too early
- the subpath can remain clearly experimental without grouping unrelated future tools
- package contents and exports can include only this focused API when promoted

### Public API name

Future public function:

```js
generateFileRoutes(options)
```

Initial public shape should stay close to the current writer helper:

```js
await generateFileRoutes({
  rootDir: 'routes',
  outputFile: '.potentia/routes.generated.js',
  packageName: '@potentiajs/core'
});
```

### Config shape

Initial public options:

- `rootDir`: route tree root, default likely `routes`
- `outputFile`: generated module path, default likely `.potentia/routes.generated.js`
- `packageName`: package import specifier for generated output, default `@potentiajs/core`
- `cwd`: optional base directory for resolving relative paths

Future options should be additive and conservative.

### CLI

Public CLI is deferred.

Future CLI direction may be:

```bash
bunx @potentiajs/core routes generate --root routes --out .potentia/routes.generated.js
```

But this block does not add a `bin` field or CLI command.

Reasons to defer CLI:

- CLI creates a broader workflow commitment than a scriptable API
- registry publish path is still blocked
- watch mode, config files, and project integration need separate design
- current internal script is enough for repo validation, not public UX

### Internal script

`bun run generate:file-routes` remains internal.

It should not be documented as a public package command. It can inform the future CLI implementation but should not be treated as a stable public workflow.

### Dev-only status

The future public subpath should be documented as dev/build-time only:

- safe to run in scripts/build steps
- not meant for production request-time scanning
- generated output is runtime-safe explicit route composition
- scanner/generator APIs remain experimental

### Package identity handling

Default generated imports should be:

```txt
@potentiajs/core
```

The API should allow `packageName` override for:

- repository self-import tests
- monorepo/link workflows
- future package identity changes
- private forks

## Deferred

- root export
- public CLI/bin
- watch mode
- config file discovery
- `fromFiles()` runtime helper
- `@potentiajs/core/dev` umbrella subpath
- public scanner/mapper/generator low-level API stability
- package subpath implementation

## Blockers

No design blocker remains. Implementation should wait for a separate File Routing Public API Foundation block.

## Publish status

No publish command was run.
