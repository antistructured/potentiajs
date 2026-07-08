# File Routing CLI Routes Generate Command

## Files inspected

- `src/cli.js`
- `src/file-routing.js`
- `src/dev/file-routing/writer.js`
- CLI design decision docs

## Files changed

- `src/cli.js`
- `docs/internal/file-routing-cli-routes-generate-command.md`

## Behavior

Implemented:

```bash
potentia routes generate
```

The command calls:

```js
await generateFileRoutes({
  rootDir,
  outputFile,
  packageName,
  cwd
});
```

via the public file-routing subpath boundary imported by `src/cli.js`.

## Path handling

- `--root` maps to `rootDir`
- `--out` maps to `outputFile`
- `--package` maps to `packageName`
- `--cwd` maps to `cwd`
- relative root/out values are resolved by the existing writer relative to `cwd`
- default cwd comes from the CLI runtime `process.cwd()`

## Success output

Success prints to stdout:

```txt
Generated file routes:
- root: <root>
- output: <out>
- routes: <count>
- scopes: <count>
```

Exit code: `0`.

## Generation failure output

Generation failure prints to stderr:

```txt
File route generation failed:
- <CODE> <LOCATION> <MESSAGE>
```

Exit code: `1`.

Diagnostic location preference:

1. `filePath`
2. `relativePath`
3. `routePath`
4. `rootDir`
5. `outputFile`

## Unexpected failure output

Unexpected errors are reported without stack traces:

```txt
File route generation failed:
- POTENTIA_FILE_ROUTE_UNEXPECTED <message>
```

Exit code: `1`.

## Boundaries preserved

The command does not implement:

- watch mode
- config files
- compiler/build commands
- dev server
- project generator
- runtime request-time filesystem scanning
- route convention expansion

## Blockers

None.

## Publish status

No publish command was run.
