# Form State Projection / Manifest Relationship Decision

## Files inspected

- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `README.md`
- `docs/internal/action-result-redirect-semantics-report.md`
- `docs/internal/form-state-response-envelope-decision.md`
- `docs/internal/form-state-redirect-after-post-decision.md`

## Files changed

- `docs/internal/form-state-projection-manifest-decision.md`

## Decision summary

Form-state projection/manifest metadata should be deferred until the form-state helper exists.

Current manifest action metadata already captures useful foundations:

- action id
- route id/path/method
- input/output projections
- accepted content types
- plain form capability
- fetch enhancement possibility
- projection-only client validation
- result semantics

Do not add new manifest fields in this design gate.

## Future metadata candidate

A future implementation may add form metadata such as:

```js
form: {
  capable: true,
  input: 'action.input',
  method: 'POST',
  contentTypes: ['application/x-www-form-urlencoded'],
  issueRootKey: '_form',
  valuePreservation: 'safe-parsed-values',
  redirectAfterPost: 'explicit-303-recommended'
}
```

## What manifests may eventually describe

Future manifests may describe:

- form-capable actions
- accepted form content types
- input contract field summaries when statically available
- issue root key (`_form`)
- safe value preservation policy name
- explicit redirect-after-post recommendation
- progressive enhancement stance
- sensitivity metadata if contract/form metadata exists later

## What manifests should not do

Manifests should not:

- precompute runtime form issues
- generate submitted value maps
- infer sensitive fields from arbitrary user code
- become OpenAPI
- become a client SDK
- generate forms
- require sessions/cookies

## Stability decision

Keep manifest output stable until runtime form-state behavior exists and tests prove the shape.

Reasoning:

- projection should describe implemented behavior, not aspirational helper semantics
- premature metadata can create compatibility obligations
- existing `enhancement.plainForm` already signals plain-form capability enough for now

## Deferred

- manifest `form` object
- projected sensitive-field metadata
- form generator inputs
- OpenAPI/client metadata
- content negotiation metadata

## Blockers

- Sensitive field metadata needs a real contract/form metadata source.
- Form envelope helper must exist before manifest can honestly describe its behavior.
