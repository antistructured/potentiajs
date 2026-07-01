# Form State Redirect-After-Post Decision

## Files inspected

- `src/kernel/response.js`
- `src/kernel/action.js`
- `tests/kernel-action-redirect.test.js`
- `docs/internal/action-result-redirect-semantics-report.md`
- `docs/internal/form-state-response-envelope-decision.md`

## Files changed

- `docs/internal/form-state-redirect-after-post-decision.md`

## Decision summary

Potentia should not auto-redirect after successful form POSTs.

Successful form submissions should redirect only when the action explicitly returns a redirect.

Recommended pattern:

```js
return redirect('/users', 303);
```

## 303 recommendation

Docs should recommend `303 See Other` after successful form submissions because it converts the follow-up navigation to a `GET` and avoids resubmitting the form on refresh.

`302` remains available through existing `redirect('/path')` and should not be removed or changed.

## Existing helper sufficiency

Existing `redirect(location, status)` is sufficient for the next stage.

Do not add `formRedirect(...)`, `seeOther(...)`, or redirect aliases in the design gate.

A future helper may be reconsidered only if repeated implementation/examples prove `redirect('/path', 303)` is too noisy.

## Validation failures

Validation failures should not redirect by default.

They should return a response body containing safe form state or the existing action diagnostic envelope. This keeps failed plain HTML submissions server-renderable without requiring session flash storage.

## Domain failures

Domain failures should not redirect by default.

Intentional business/domain failures should return a response body so the user can correct the submission. Examples:

- email already taken
- invalid invite code
- quota exceeded

## Session/flash relationship

Session/flash helpers remain deferred.

A future session/flash layer could support redirect-with-errors flows, but the first form-state helper should not require cookies or server-side session storage.

## Progressive enhancement relationship

Enhanced clients should follow the same server semantics. They may choose to render a form envelope or follow redirects, but they should not depend on hidden RPC redirect rules.

## Deferred

- `formRedirect(...)` helper
- `seeOther(...)` helper
- flash/session helpers
- redirect-with-errors flow
- content negotiation for enhanced clients

## Blockers

- Redirect-with-errors requires storage policy, expiration, cookie/session security, and back-button behavior decisions.
