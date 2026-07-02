# Owner License Decision

## Current license state

- `package.json` license: `UNLICENSED`
- root `LICENSE`: absent
- README license section: absent

## Owner decision

Decision: **decided**.

Owner preference:

- MIT, or another free/open license if MIT becomes unsuitable

Implementation default for final release prep:

- `MIT`

## Rationale

MIT is the best fit for broad public-preview adoption: low friction, familiar to npm users, and appropriate for an experimental framework package unless stronger patent language or reciprocal terms are required.

Apache-2.0 remains the fallback if explicit patent language becomes important before release.

## Future changes

During Final Public Preview Release Prep:

1. Update `package.json` `license` to `MIT`.
2. Add root `LICENSE` with MIT license text and owner/year.
3. Add/update README license wording if needed.
4. Include `LICENSE` in package dry-run verification.

## Blocked changes in this decision-capture block

- No `LICENSE` file added here.
- No `package.json` license change here.
- No README license claim added here.
