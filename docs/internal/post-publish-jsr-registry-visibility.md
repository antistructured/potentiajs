# Post-Publish JSR Registry Visibility

## Commands / inspection

```bash
npx jsr info @potentiajs/core
curl -fsSL https://jsr.io/@potentiajs/core/meta.json
curl -fsSL https://jsr.io/@potentiajs/core/0.1.0-preview.0_meta.json
```

## Results

### `npx jsr info`

```txt
@potentiajs/core@0.1.0-preview.0 | latest: - | versions: 1
An experimental Bun-first JavaScript framework kernel for explicit, contract-driven request handling

npm tarball: https://npm.jsr.io/~/11/@jsr/potentiajs__core/0.1.0-preview.0.tgz
published: 20 hours ago
```

### JSR package metadata API

```json
{
  "scope": "potentiajs",
  "name": "core",
  "latest": null,
  "versions": {
    "0.1.0-preview.0": {
      "createdAt": "2026-07-09T02:56:21.482852Z"
    }
  }
}
```

### JSR version exports

The version metadata exposes:

```json
{
  ".": "./src/index.js",
  "./file-routing": "./src/file-routing.js",
  "./forms": "./src/forms.js"
}
```

## Confirmed

- JSR package exists
- JSR version `0.1.0-preview.0` exists
- JSR exports include `.`, `./file-routing`, and `./forms`
- no JSR export parse errors occurred
- README/package metadata is visible to JSR tooling

## Findings

The JSR version manifest appears broader than intended: it includes files such as workflow files and repo-only/dev example paths in addition to runtime source and public package files. This does not block import/export verification, but should be tightened in the next patch release by auditing JSR include/exclude behavior.

Also, JSR reports `latest: -` even though the explicit version is visible. That is acceptable for exact-version/public verification, but worth deciding whether JSR should have a latest pointer for future previews.

## Blockers

None for registry visibility or export parsing.
