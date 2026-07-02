# Final Release Package Identity / Metadata

## Files inspected

- `package.json`
- `docs/internal/final-release-npm-name-availability.md`
- `docs/internal/owner-publish-decision-checklist-report.md`
- `docs/internal/owner-decision-follow-up.md`

## Files changed

- `package.json`
- `docs/internal/final-release-package-identity-metadata.md`

## Applied package identity

Live npm name availability selected:

```txt
potentiajs
```

Applied package metadata:

- `name`: `potentiajs`
- `version`: `0.1.0-preview.0`
- `private`: `false`
- `license`: `MIT`
- `repository.url`: `git+https://github.com/antistructured/potentiajs.git`
- `bugs.url`: `https://github.com/antistructured/potentiajs/issues`
- `homepage`: `https://github.com/antistructured/potentiajs#readme`

## Publish config decision

`publishConfig` remains absent.

Reason: the chosen package name is unscoped (`potentiajs`). Unscoped npm packages are public by default when published. `publishConfig.access: public` is primarily needed for scoped packages; if the fallback `@weipertda/potentiajs` is used later, final release prep should add:

```json
{
  "publishConfig": {
    "access": "public"
  }
}
```

The final dry-run should use the current unscoped package metadata and the real publish gate can use:

```bash
npm publish
```

or, if owner prefers an explicit command and npm accepts it for unscoped packages:

```bash
npm publish --access public
```

## Notes

The live package already had `name: potentiajs` before this pass started, but this pass documents the npm availability evidence and formally applies the rest of the release metadata.

The live package had `version: 0.1.0` before this pass; this pass corrected it to the owner-selected prerelease target `0.1.0-preview.0`.

## Blockers

No package identity blocker remains.

External blockers remain:

- GitHub remote in the working copy may still need to be updated externally from `poteniajs` to `potentiajs`.
- npm account access / 2FA / trusted publishing or token configuration cannot be verified locally.

## Publish status

Real publish was not run.
