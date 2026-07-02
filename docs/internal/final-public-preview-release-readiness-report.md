# Final Public Preview Release Readiness Report

## 1. Current package name

```txt
potentiajs
```

The preferred unscoped npm package name was verified as available by live npm registry check at prep time.

## 2. Current version

```txt
0.1.0-preview.0
```

This is a prerelease tag in the `0.x.x` family and does not imply API stability.

## 3. Current license

```txt
MIT
```

Root license file:

```txt
LICENSE
```

Copyright holder:

```txt
Daniel Weipert
```

## 4. Current private/public state

```json
"private": false
```

The package is configured as a public-preview package candidate.

## 5. Repository metadata

```txt
git+https://github.com/antistructured/potentiajs.git
https://github.com/antistructured/potentiajs/issues
https://github.com/antistructured/potentiajs#readme
```

The prior `poteniajs` typo is corrected in package metadata.

## 6. Publish config

`publishConfig` is absent intentionally.

Reason: selected package name is unscoped (`potentiajs`), and unscoped npm packages publish publicly by default. If the package later falls back to `@weipertda/potentiajs`, add `publishConfig.access: public`.

## 7. Type declaration status

Included:

```txt
src/index.d.ts
```

Package metadata includes:

```json
"types": "./src/index.d.ts"
```

Root export metadata includes a `types` condition.

Declaration posture is conservative and experimental. Source remains plain JavaScript ESM.

## 8. CI workflow status

Existing CI workflow:

```txt
.github/workflows/ci.yaml
```

Manual release-prep workflow:

```txt
.github/workflows/publish-preview.yaml
```

The publish-preview workflow is manual-only and dry-run-only. It runs:

- `bun run check:release`
- `npm pack --dry-run --json`
- `npm publish --dry-run --tag preview`

It does not include a real publish step and does not require `NPM_TOKEN`.

## 9. Changelog status

Included:

```txt
CHANGELOG.md
```

The changelog contains the `0.1.0-preview.0` public preview notes and experimental-status warning.

## 10. Dry-run results

- `bun run test`: pass — `557 pass`, `0 fail`, `1173 expect() calls`
- `bun run check:release`: pass — `557 pass`, `0 fail`, `1173 expect() calls`
- `npm pack --dry-run --json`: pass
- `npm publish --dry-run --tag preview`: pass

## 11. Packed artifact smoke results

Packed artifact install smoke: pass.

Observed output:

```json
{"packageName":"potentiajs","version":"0.1.0-preview.0","sigil":"function","exports":24,"status":200,"body":{"name":"Ada"},"formField":"name","hasPassword":false}
```

## 12. Package contents summary

- tarball: `potentiajs-0.1.0-preview.0.tgz`
- entry count: `40`
- unpacked size: `110586`
- `LICENSE`: included
- `CHANGELOG.md`: included
- `README.md`: included
- `src/index.d.ts`: included
- `docs/internal/`: excluded
- `tests/`: excluded
- `.github/`: excluded from package

## 13. Real publish status

Real publish was not run.

Forbidden commands not run:

```bash
npm publish
jsr publish
```

## 14. Remaining blockers

No local package-readiness blocker remains.

External/final-gate blockers:

- owner must explicitly command the final publish
- npm account access / 2FA / trusted publishing or token setup must be ready
- GitHub release environment/protection may need to be configured before enabling real CI publish
- final npm name availability should be rechecked immediately before real publish
- JSR remains deferred pending a JSR Compatibility Design Gate

## 15. Exact final manual publish command if ready

After owner confirmation and final dry-run:

```bash
npm publish --tag preview
```

For this unscoped package, default npm access is public.

## 16. Exact GitHub workflow path if ready

Dry-run workflow path:

```txt
.github/workflows/publish-preview.yaml
```

This workflow is ready for manual dry-run preparation, not real publish.

## 17. Recommended final action

Recommendation: **Ready for Final Publish Command Gate**.

Next step is not more release prep. The owner must explicitly say an equivalent of:

```txt
Publish Potentia now.
```

Only then should a real publish command or real publish workflow be enabled/run.
