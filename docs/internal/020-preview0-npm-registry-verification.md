# 0.2.0-preview.0 npm Registry Verification

## Commands run

```bash
npm view @potentiajs/core version
npm view @potentiajs/core versions --json
npm view @potentiajs/core dist-tags --json
npm view @potentiajs/core@0.2.0-preview.0 name version dist.tarball
npm view @potentiajs/core@preview version
npm view @potentiajs/core@latest version
```

## Confirmed

- package name: `@potentiajs/core`
- version `0.2.0-preview.0` exists
- `preview` points to `0.2.0-preview.0`
- `latest` remains `0.1.0`
- tarball URL is present: `https://registry.npmjs.org/@potentiajs/core/-/core-0.2.0-preview.0.tgz`

## Versions

```json
[
  "0.1.0-preview.0",
  "0.1.0-preview.1",
  "0.1.0",
  "0.2.0-preview.0"
]
```

## Dist-tags

```json
{
  "preview": "0.2.0-preview.0",
  "latest": "0.1.0"
}
```

## Blockers

None.
