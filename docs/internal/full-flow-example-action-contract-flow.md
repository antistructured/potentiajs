# Full Flow Example Action / Contract Flow

## Files inspected

- `src/kernel/action.js`
- `src/kernel/app.js`
- `src/kernel/form-state.js`
- `src/kernel/form-projection.js`
- `examples/full-flow-basic/form.js`

## Files changed

- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/routes/users/index.js`
- `docs/internal/full-flow-example-action-contract-flow.md`

## Flow

The example defines:

- `CreateUserInput` SigilJS contract
- `createUserAction` action descriptor with the input contract
- `createUserForm = projectForm(createUserAction)`
- `handleCreateUser(request)` for URL-encoded POST flow

Fields:

- `name`
- `email`
- `password`

POST flow:

1. Parse URL-encoded form input.
2. Validate with `CreateUserInput.safeParse(...)` plus example-level email/required checks.
3. On validation failure, create `createFormState(...)` with field issues and render the form.
4. On domain failure (`taken@example.com`), create `createFormState(...)` with a root error and render the form.
5. On success, redirect to `/users/<slug>` with status `303`.

## Sensitive policy

Password is projected as a password field. Failed state is created with the submitted password present in input, but `createFormState(...)` and `renderForm(...)` omit the sensitive value from rendered HTML.

## Ergonomic gaps

Current action route execution validates `action.input` before the action handler runs. That is good for JSON/error APIs, but it makes same-route HTML form re-rendering on input-contract failure awkward because the handler does not receive the parsed invalid input.

This example therefore uses the action descriptor for contract-native form projection and performs the POST validation/render path explicitly in the route handler. No core API was changed.

Potential future design gate:

```txt
Action HTML Failure Rendering / Form Re-Render Ergonomics
```

## Blockers

None.

## Publish status

No publish command was run.
