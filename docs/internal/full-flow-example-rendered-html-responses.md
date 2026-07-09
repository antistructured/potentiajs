# Full Flow Example Rendered HTML Responses

## Files inspected

- `src/forms.js`
- `src/kernel/response.js`
- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/routes/`

## Files changed

- `examples/full-flow-basic/form.js`
- `examples/full-flow-basic/routes/index.js`
- `examples/full-flow-basic/routes/users/index.js`
- `examples/full-flow-basic/routes/users/new.js`
- `examples/full-flow-basic/routes/users/[id].js`
- `docs/internal/full-flow-example-rendered-html-responses.md`

## Responses

Implemented server-side HTML responses for:

- `GET /` home page
- `GET /users/new` rendered create-user form
- `POST /users` validation failure page (`400`)
- `POST /users` domain failure page (`409`)
- `GET /users/:id` success/detail page

Success path redirects with:

```txt
303 Location: /users/ada
```

## Rendering behavior

The form response uses:

- `projectForm(createUserAction)`
- `renderForm(...)`
- optional `createFormState(...)`

Rendered form shows:

- labels
- projected fields
- safe preserved values
- omitted password value
- field errors
- root/domain errors
- submit button

All form rendering remains server-side plain HTML strings.

## No JSX / runtime

No JSX, component system, frontend runtime, browser hydration, or client-side form runtime was added.

## Blockers

None.

## Publish status

No publish command was run.
