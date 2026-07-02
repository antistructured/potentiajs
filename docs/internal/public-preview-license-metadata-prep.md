# Public Preview License / Metadata Prep

## Files inspected

- `package.json`
- `README.md`
- Git remote URL from `git remote -v`
- root `LICENSE*` search
- `docs/internal/public-preview-publish-prep-scope-lock.md`

## Files changed

- `package.json`
- `docs/internal/public-preview-license-metadata-prep.md`

## License decision

Decision: keep blocked.

- Current package metadata remains `UNLICENSED`.
- No root `LICENSE` file was added.
- Reason: no owner-confirmed license choice was found in repository files or prior readiness reports.
- MIT was not assumed, even though it is a plausible future preview choice.

## Repository metadata decision

Decision: update from confirmed Git remote.

Confirmed remote:

```txt
https://github.com/antistructured/poteniajs.git
```

Added package metadata:

- `repository.type`: `git`
- `repository.url`: `git+https://github.com/antistructured/poteniajs.git`
- `bugs.url`: `https://github.com/antistructured/poteniajs/issues`
- `homepage`: `https://github.com/antistructured/poteniajs#readme`

Note: the remote path is used exactly as configured; no alternate repository URL was invented.

## Description / keywords

Updated description to be preview-honest:

```txt
Experimental Bun-first JavaScript framework kernel for contract-driven routing, actions, and form metadata.
```

Added accurate keywords:

- `runtime-contracts`
- `server-actions`
- `forms`

Existing accurate keywords remain.

## Still blocked

- License choice.
- Root `LICENSE` file.
- Public/private package flip.
- npm publish account/access/2FA.
- JSR scope/name/metadata.

## Blockers

License remains the release-blocking metadata item. Repository metadata is resolved from the actual Git remote.
