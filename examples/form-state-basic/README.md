# Form State Basic Example

This example demonstrates the experimental opt-in `createFormState(...)` helper with action-style submissions.

It is intentionally not a form generator, frontend runtime, client SDK, OpenAPI layer, session/flash helper, or multipart/file upload example.

## What it shows

- URL-encoded action input
- manual validation failures wrapped in form state
- domain failures returned through `fail(createFormState(...), status)`
- sensitive value omission from preserved `values`
- explicit success redirect with `303`
- renderer-independent projection metadata through `projectForm(createUserAction)`

## Plain HTML form shape

```html
<form method="post" action="/users">
  <input name="name">
  <input name="email">
  <input name="password" type="password">
  <button type="submit">Create user</button>
</form>
```

## Behavior

Invalid submission:

```txt
POST /users
name=Ada&email=not-an-email&password=secret
```

returns a `400` form state response. `values.name` and `values.email` are preserved, while `values.password` is omitted.

Domain failure:

```txt
POST /users
name=Ada&email=taken%40example.test
```

returns a `409` form state response with an `_form` error.

Successful submission redirects explicitly:

```txt
303 Location: /users
```

The example also exports `formProjection`, a metadata-only description of the action input contract. It includes field names, conservative input hints, and a sensitive flag for `password`. It does not render HTML or generate a client helper.

## Run locally

```bash
bun examples/form-state-basic/index.js
```
