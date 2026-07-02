# Public Preview Version / Private / Publish Config Decision

## Files inspected

- `package.json`
- `README.md`
- `docs/internal/public-preview-publish-prep-scope-lock.md`
- `docs/internal/public-preview-license-metadata-prep.md`

## Files changed

- `docs/internal/public-preview-version-publish-config-decision.md`

## Decisions

| Item | Decision | Reason |
| --- | --- | --- |
| package name | keep `potentia-js` | Current package name is consistent across docs and examples, but external npm availability is not verified. |
| version | keep `0.0.1` | Future preview target `0.0.2-preview.0` is documented but license/public publish decisions remain blocked. |
| private | keep `true` | Do not quietly switch public visibility without owner-confirmed license/npm publish intent. |
| publishConfig | do not add | `publishConfig.access: public` should be added only when intentionally preparing the final publishable package. |
| API status | all experimental | No stable API commitment in this block. |
| npm scope | none | No owner-confirmed scope decision. |

## Package config after decision

```json
{
  "name": "potentia-js",
  "version": "0.0.1",
  "private": true,
  "license": "UNLICENSED"
}
```

No `publishConfig` is present.

## Future target

Likely future preview target remains:

```txt
0.0.2-preview.0
```

This block does not apply that version because release-critical owner decisions are still blocked.

## Publish status

No publish occurred.

## Blockers

- license choice/root `LICENSE`
- npm publish intent/access/2FA/package availability
- final package visibility decision
- final preview version decision
- optional JSR package scope/name decision
