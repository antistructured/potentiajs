# File Routing Minimal CLI Foundation Final Verification

## Commands run

```bash
bun run test
bun run check:release
npm pack --dry-run --json
npm pack --pack-destination <tmp> --json
```

A packed installed-artifact CLI smoke was also run.

No publish commands were run.

## Results

### Tests

```txt
573 pass
0 fail
1271 expect() calls
```

### Release check

```txt
573 pass
0 fail
1271 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 57
bin/potentia.js: included
src/cli.js: included
examples/file-routing-basic/: included
docs/internal/: excluded
```

### Packed CLI smoke

Installed local tarball in a fresh temp project and ran:

```bash
./node_modules/.bin/potentia routes generate
```

CLI stdout:

```txt
Generated file routes:
- root: routes
- output: .potentia/routes.generated.js
- routes: 2
- scopes: 0
```

CLI stderr:

```txt

```

Smoke output:

```json
{"rootStatus":200,"rootBody":"home","userStatus":200,"userBody":{"id":"ada"},"generatedHasHeader":true,"generatedHasPackageImport":true,"generatedHasRuntimeFs":false,"binExists":true}
```

## Invariants verified

- package name unchanged: `@potentiajs/core`
- version unchanged: `0.1.0-preview.0`
- package bin added: `potentia -> ./bin/potentia.js`
- root exports unchanged
- file-routing subpath unchanged
- no watch mode added
- no config support added
- no compiler/dev server added
- no new dependencies added
- no runtime request-time filesystem scanning added
- README documents CLI accurately
- example docs document CLI accurately
- release blockers remain parked

## CLI implemented

```bash
potentia routes generate
```

Supported flags:

```txt
--root <dir>
--out <file>
--package <specifier>
--cwd <dir>
```

Exit codes:

```txt
0 = success
1 = generation / diagnostic / IO failure
2 = invalid usage / options
```

Deferred:

```txt
--json
--check
--watch
--config
--manifest
--clean
--verbose
--silent
```

## Remaining blockers

None for this minimal CLI foundation block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next file-routing block:

```txt
File Routing CLI Polish / Check Mode Design Gate
```

Alternative if release health is urgent:

```txt
Release Blocker Fix Pass
```

## Publish status

Real publish was not run.
