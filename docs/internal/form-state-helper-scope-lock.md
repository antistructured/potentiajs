# Form State Helper Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/index.js`
- `src/kernel/action.js`
- `src/kernel/diagnostics.js`
- `src/kernel/response.js`
- `tests/kernel-action-validation-shape.test.js`
- `tests/kernel-action-domain-failure.test.js`
- `tests/kernel-field-diagnostics-regression.test.js`
- `tests/kernel-field-diagnostics-safety.test.js`
- `examples/action-basic/`
- `docs/internal/form-state-form-response-design-gate-report.md`
- `docs/internal/form-state-safe-value-preservation-decision.md`
- `docs/internal/form-state-issue-mapping-decision.md`
- `docs/internal/form-state-response-envelope-decision.md`
- `docs/internal/form-state-redirect-after-post-decision.md`

## Files changed

- `docs/internal/form-state-helper-scope-lock.md`

## Findings

The current action layer already provides the ingredients needed for an opt-in form state helper:

- parsed JSON and URL-encoded action input via `ctx.input`
- repeated URL-encoded fields as arrays of strings
- safe canonical issue objects
- route/action diagnostic envelopes with `ok: false`, `boundary`, and `issues`
- domain failures through `fail(...)`
- explicit redirects through `redirect(location, status)`

No current code provides:

- safe value preservation for form resubmission
- issue grouping into field-keyed `errors`
- an opt-in `kind: 'form'` envelope

## Decisions

Implement one small experimental public helper:

```js
createFormState(input)
```

Reasoning:

- the block explicitly allows one helper
- examples need a direct app-facing API
- keeping one helper avoids premature `form()`, `formAction()`, `useForm()`, `formRedirect()`, or generator surfaces

Implementation should live in:

- `src/kernel/form-state.js`

Root export:

- `createFormState`

Internal helper exports from `src/kernel/form-state.js` are acceptable for tests, but only `createFormState` should be exported from `src/index.js`.

## Helper defaults

- opt-in only
- never changes default action behavior
- preserves values from parsed input only
- omits sensitive fields by default
- rejects dangerous keys
- groups canonical issues by `issue.field`
- maps root/invalid issues to `_form`
- preserves issue order
- defaults `meta` to `null`
- defaults success `error` to `null`

## Rejected scope

This block must not add:

- automatic action response conversion
- form generator
- frontend runtime
- client SDK
- OpenAPI
- session/flash helpers
- redirect-with-errors
- multipart/file handling
- manifest `form` metadata unless later explicitly justified
- DB/auth
- CLI/compiler
- TypeScript source
- publish prep

## Blockers

- Domain failures lack field-level metadata unless the caller supplies issues. The helper should create a safe root-level `_form` issue from `error` when needed.
- Name-based sensitive detection is conservative and can miss project-specific names; future metadata can improve it.
