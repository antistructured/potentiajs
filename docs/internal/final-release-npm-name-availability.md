# Final Release npm Name Availability

## Method

Live npm registry checks run from the repository root:

```bash
npm view potentiajs name version description --json
npm view @weipertda/potentiajs name version description --json
```

## Results

### `potentiajs`

Result: **available**.

Evidence:

- command exit status: `1`
- npm error code: `E404`
- registry URL: `https://registry.npmjs.org/potentiajs`
- summary: `Not Found - GET https://registry.npmjs.org/potentiajs - Not found`

Interpretation: npm has no visible package named `potentiajs` for the registry query, so the preferred unscoped package name is available from the perspective of this live check.

### `@weipertda/potentiajs`

Result: **available as fallback name**, subject to owner scope access.

Evidence:

- command exit status: `1`
- npm error code: `E404`
- registry URL: `https://registry.npmjs.org/@weipertda%2fpotentiajs`
- summary: `Not Found - GET https://registry.npmjs.org/@weipertda%2fpotentiajs - Not found`

Interpretation: npm has no visible package named `@weipertda/potentiajs` for the registry query. Publishing it would still require npm account access to the `@weipertda` scope.

## Final chosen package name

```txt
potentiajs
```

## Confidence level

High for registry non-existence at check time. This is still current external state and must be rechecked immediately before the real publish gate.

## Blockers

No package-name availability blocker found.

Remaining owner/external blockers outside package metadata:

- npm account access / 2FA / trusted publishing or token setup for CI publish cannot be verified locally.
- GitHub repository rename/remote update to `antistructured/potentiajs` may need external owner action; package metadata can still be prepared to the intended slug.

## Publish status

Real publish was not run.
