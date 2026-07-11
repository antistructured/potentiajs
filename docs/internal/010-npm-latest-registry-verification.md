# 0.1.0 npm latest Registry Verification

## Commands run

```bash
npm view @potentiajs/core version
npm view @potentiajs/core versions --json
npm view @potentiajs/core dist-tags --json
npm view @potentiajs/core@0.1.0 name version dist.tarball
npm view @potentiajs/core@latest version
npm view @potentiajs/core@preview version
```

## Confirmed

- package name: `@potentiajs/core`
- version `0.1.0` exists
- npm default version resolves to `0.1.0`
- `latest` points to `0.1.0`
- `preview` remains present and points to `0.1.0-preview.1`
- tarball URL is present: `https://registry.npmjs.org/@potentiajs/core/-/core-0.1.0.tgz`

## Versions

```json
[
  "0.1.0-preview.0",
  "0.1.0-preview.1",
  "0.1.0"
]
```

## Dist-tags

```json
{
  "latest": "0.1.0",
  "preview": "0.1.0-preview.1"
}
```

## Blockers

None.
