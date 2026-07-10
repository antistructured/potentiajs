# Post-Publish Registry Verification Scope Lock

## Files inspected

- `package.json`
- `jsr.json`
- `README.md`
- `CHANGELOG.md`
- `.github/workflows/ci.yaml`
- `.github/workflows/publish-preview.yaml`
- `.github/workflows/publish.yml`
- `docs/internal/*publish*`
- `docs/internal/*release*`
- repository status

## Published package under verification

```txt
@potentiajs/core@0.1.0-preview.0
```

## Expected registries

- npm
- JSR

## Expected npm dist-tag

```txt
preview -> 0.1.0-preview.0
```

## Expected JSR version

```txt
0.1.0-preview.0
```

## Successful public verification means

A successful verification proves the package works from outside the local workspace:

- npm registry can see `@potentiajs/core`
- npm registry can see version `0.1.0-preview.0`
- npm `preview` dist-tag resolves to `0.1.0-preview.0`
- JSR registry can see `@potentiajs/core@0.1.0-preview.0`
- a fresh temp project can install from npm registry
- Node can import the root package from `node_modules`
- Node can import `@potentiajs/core/file-routing`
- Node can import `@potentiajs/core/forms`
- root export remains unpolluted by subpath/CLI internals
- installed `potentia` binary exists and runs
- installed CLI can check/generate file routes with JSON output
- generated routes from the registry package can be served by `createApp(...)`
- registry metadata/docs are acceptable for preview users

## Scope

In scope:

- public registry visibility checks
- fresh npm install smoke
- public import smoke
- public CLI smoke
- generated route smoke from installed package
- registry metadata/docs inspection
- internal verification documentation

## Out of scope

- new framework features
- renderer/file-routing/core source changes
- workflow redesign
- version bump
- `0.1.0` final release preparation
- another publish attempt
- real publish commands

## Patch scope

Documentation only unless verification discovers a real public artifact issue.

## Publish status

No publish command is run in this block.

## Blockers

None at scope-lock time.
