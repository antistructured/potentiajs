# Registry Hygiene Version / Changelog Decision

## Artifact config changed

Yes.

`jsr.json` changed from top-level `include` / `exclude` to verified `publish.include` / `publish.exclude`, materially changing the future JSR artifact contents.

## Version decision

Prepare a hygiene patch preview:

```txt
0.1.0-preview.0 -> 0.1.0-preview.1
```

## Files changed

- `package.json`
- `jsr.json`
- `CHANGELOG.md`
- `README.md`
- `docs/internal/registry-hygiene-version-changelog-decision.md`

## Version consistency

Verified:

```bash
node -e 'const p=require("./package.json"); const j=require("./jsr.json"); if (p.version !== j.version) throw new Error(`${p.version} !== ${j.version}`); console.log(p.version)'
```

Result:

```txt
0.1.0-preview.1
```

## Changelog entry

Added:

```md
## 0.1.0-preview.1

### Registry hygiene

- Tightened the JSR artifact to exclude repo-only files.
- Preserved public JSR exports for root, file-routing, and forms.
- Added npm preview dist-tag verification posture.
- Preserved internal post-publish verification docs as project audit trail.
```

## README version label

Updated the README current-status version to `0.1.0-preview.1` so the public package docs match the prepared package metadata.

## Source API changes

None.

## Blockers

None pending full release verification.
