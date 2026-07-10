# Post-Publish npm Registry Visibility

## Commands run

```bash
npm view @potentiajs/core version
npm view @potentiajs/core versions --json
npm view @potentiajs/core dist-tags --json
npm view @potentiajs/core@0.1.0-preview.0 name version dist.tarball
npm view @potentiajs/core@preview version
```

## Results

### Current registry version

```txt
0.1.0-preview.0
```

### Versions

```json
[
  "0.1.0-preview.0"
]
```

### Dist-tags

```json
{
  "preview": "0.1.0-preview.0",
  "latest": "0.1.0-preview.0"
}
```

### Exact package metadata

```json
{
  "name": "@potentiajs/core",
  "version": "0.1.0-preview.0",
  "dist.tarball": "https://registry.npmjs.org/@potentiajs/core/-/core-0.1.0-preview.0.tgz"
}
```

### Preview tag resolution

```txt
@potentiajs/core@preview -> 0.1.0-preview.0
```

## Confirmed

- npm package exists
- npm version `0.1.0-preview.0` exists
- npm preview tag points to `0.1.0-preview.0`
- tarball URL exists
- package name is `@potentiajs/core`

## Note

The npm `latest` dist-tag also points to `0.1.0-preview.0`. This is acceptable for visibility, but it is worth deciding whether future preview publishes should keep preview-only tagging or allow `latest` during early public preview.

## Blockers

None.
