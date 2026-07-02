# Owner Decision Follow-Up

## Source

Owner supplied decisions after the Owner Publish Decision Checklist.

## Captured owner choices

| Area | Decision |
| --- | --- |
| License | MIT, or another free/open license if MIT becomes unsuitable. Use MIT as the default release-prep implementation choice. |
| Repository slug | GitHub repo should be `antistructured/potentiajs` — no hyphen. Current metadata/remote spelling `poteniajs` should be corrected before public preview. |
| npm package name | Public unscoped package should be `potentiajs` if available. Fallback scoped package: `@weipertda/potentiajs`. |
| npm visibility | Public. |
| Publish method | CI publish is desired. Final implementation should use protected/manual-trigger CI publish rather than automatic publish on every push. |
| Versioning | Stay in `0.x.x`. Use a SemVer milestone version rather than deriving directly from commit count. Recommended preview target: `0.1.0-preview.0`. |
| JSR scope/name | Mirror npm identity where possible. Since JSR uses scoped package identity, use `@weipertda/potentiajs` if JSR is included. |
| Type declaration posture | Best option for public npm + future JSR is minimal, conservative handwritten root declarations before public preview, without converting source to TypeScript. |
| Changelog posture | Create root `CHANGELOG.md` during final release prep from internal release notes. |

## Version rationale

Current committed history count is `3`, but package versions should communicate API/product maturity, not commit count. Potentia has moved beyond a tiny patch from `0.0.1`: routing, composition, contracts, effects, actions, diagnostics, form state/projection, manifests, package smoke, and export pruning are now present. For a first public preview that is still explicitly experimental, `0.1.0-preview.0` is the best fit.

## Remaining external checks

Before final release prep can safely apply package changes:

- confirm or rename GitHub repository to `antistructured/potentiajs`
- check npm availability for `potentiajs`
- if unavailable, use `@weipertda/potentiajs`
- confirm npm automation credentials and 2FA/token posture for CI publish
- decide whether JSR ships with first preview or follows after a JSR compatibility gate

## Recommended next block

Proceed to **Final Public Preview Release Prep** once npm package availability and repository rename/metadata are confirmed.

If JSR must ship in the same preview, run **JSR Compatibility Design Gate** before final release prep.
