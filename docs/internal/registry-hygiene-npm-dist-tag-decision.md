# Registry Hygiene npm Dist-Tag Decision

## Commands run

Read-only registry commands:

```bash
npm view @potentiajs/core dist-tags --json
npm view @potentiajs/core versions --json
```

## Current tags

```json
{
  "preview": "0.1.0-preview.0",
  "latest": "0.1.0-preview.0"
}
```

## Current versions

```json
[
  "0.1.0-preview.0"
]
```

## Decisions

### 1. Is `latest` pointing to preview acceptable?

Decision: acceptable temporarily.

Rationale:

- `0.1.0-preview.0` is the only published version.
- The package is publicly verified and usable.
- Removing `latest` when only one version exists can create odd npm UX.
- README and metadata clearly say experimental/no stable API.

### 2. Should future previews use only `--tag preview`?

Decision: yes.

Future preview publishes should explicitly use:

```bash
npm publish --access public --tag preview --provenance=false
```

and should verify afterward that:

```txt
preview -> preview version
latest -> final stable/intentional version, not accidentally advanced
```

### 3. Should the workflow explicitly avoid promoting preview to latest?

Decision: yes for future previews.

The implementation pass should make preview tagging intentional and add a post-publish/readiness check that detects accidental `latest` movement.

### 4. Should final `0.1.0` use `--tag latest`?

Decision: yes.

Final `0.1.0` should intentionally publish/promote `latest` once final release criteria are met.

### 5. Should current `latest` be removed or left alone until final?

Decision: leave current `latest` alone unless it causes install confusion.

No mutation command should run in this planning block. A manual correction remains available later if desired:

```bash
npm dist-tag rm @potentiajs/core latest
```

but is not recommended right now because it may make npm default install behavior less clear while only one version exists.

## Future workflow

Recommended future preview policy:

- preview releases publish with `--tag preview`
- preview release verification checks both `preview` and `latest`
- final release publishes/promotes with `--tag latest`
- do not mutate current tags in this planning block

## Blockers

None.
