# Diagnostics Projection / Manifest Decision

## Files inspected

- `src/kernel/contract-projection.js`
- `src/kernel/route-projection.js`
- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `docs/internal/contract-projection-upgrade-report.md`
- `docs/internal/action-result-redirect-semantics-report.md`
- `docs/internal/field-diagnostics-issue-shape-decision.md`

## Files changed

- `docs/internal/diagnostics-projection-manifest-decision.md`

## Decision

Do not precompute possible runtime issues in projection or manifests.

Projection and manifest outputs should remain static metadata only. They must not execute handlers, hooks, or contract validators and must not invent issue paths from incomplete metadata.

## Recommended future manifest metadata

A future implementation may add minimal diagnostics metadata to action and/or route manifest entries:

```js
diagnostics: {
  issueShape: {
    code: 'string',
    message: 'string',
    path: 'array',
    field: 'string|null',
    boundary: 'string',
    source: 'sigil|generic|framework|unknown',
    expected: 'string|null',
    received: 'string|null',
    meta: 'null'
  },
  boundaries: ['input', 'output'],
  fieldIssues: 'runtime'
}
```

For route entries, `boundaries` should reflect route contract boundaries that are present or possible on that route.

For action entries, `boundaries` should include action boundaries such as `input`, `output`, and `handler` when applicable.

## Field metadata vs issue metadata

Existing projection can expose static field metadata for SigilJS contracts via:

- `fields`
- `required`
- `optional`
- nested field summaries where available

That metadata is not the same as runtime issues.

Future forms/tooling may combine static field projection with runtime issue arrays, but Potentia should not generate form error maps during projection.

## Rejected scope

Do not add:

- possible runtime issue lists
- OpenAPI-style schema generation
- client/form error maps
- localized message catalogs
- validator execution during projection
- inferred issue paths for generic contracts

## Relationship to action result semantics

Action manifest entries already include result semantics:

```js
result: {
  success: 'response-projection',
  validationFailure: 'action-input-failed',
  redirect: 'explicit',
  domainFailure: 'fail-result'
}
```

Diagnostics metadata should complement this if implemented later, not replace it.

## Initial implementation recommendation

For the first diagnostics implementation block, prioritize runtime issue normalization and tests before manifest metadata.

If metadata is added, keep it minimal and deterministic:

- canonical issue shape descriptor
- boundary list
- `fieldIssues: 'runtime'`

## Deferred

- implementation
- manifest schema versioning
- possible issue generation
- form generator integration
- client SDK/OpenAPI mapping
- docs generator output

## Blockers

- Until runtime issue normalization exists, manifest diagnostics metadata would be declarative only.
- Over-eager manifest additions could imply implemented form/client behavior that does not exist.
