# Full Flow Basic Example

This example shows Potentia as a compact contract-native app foundation.

It demonstrates:

```txt
file routes
→ generated routes
→ app
→ action/form contract metadata
→ URL-encoded POST
→ contract validation
→ form projection
→ server-rendered HTML
→ form state after failure
→ explicit redirect after success
```

No JSX, frontend runtime, browser hydration, client SDK, OpenAPI generator, database, auth, session/flash helper, or multipart/file upload helper is used.

## Route tree

```txt
examples/full-flow-basic/
  generate.js
  app.js
  form.js
  routes/
    index.js
    users/
      index.js
      new.js
      [id].js
      _routes.js
```

Generated routes:

```txt
GET  /
GET  /users/new
POST /users
GET  /users/:id
```

## Generate routes

From the repository root:

```bash
bun examples/full-flow-basic/generate.js
```

The generated module is written to:

```txt
examples/full-flow-basic/.potentia/routes.generated.js
```

The generated output is inspectable JavaScript and is not scanned from the filesystem at request time. It should not be committed for this example.

## Check generated routes

The CLI can verify the generated file is current:

```bash
bun bin/potentia.js routes check \
  --cwd examples/full-flow-basic \
  --root routes \
  --out .potentia/routes.generated.js \
  --json
```

## Run the app locally

After generation:

```bash
bun examples/full-flow-basic/app.js
```

Then open:

```txt
http://localhost:3000/users/new
```

## Form flow

### GET form

```txt
GET /users/new
→ projectForm(createUserAction)
→ renderForm(...)
→ HTML response
```

### POST validation failure

```txt
POST /users
content-type: application/x-www-form-urlencoded

name=&email=bad&password=secret
```

The example validates the parsed input with the SigilJS contract plus small example-level checks. It returns status `400`, renders field errors, preserves safe values, and omits the password value.

Rendered forms include `data-potentia-*` styling/testing hooks and baseline accessibility attributes such as `aria-describedby` and `aria-invalid` when help text or errors are present.

### POST domain failure

```txt
POST /users
name=Ada&email=taken@example.com&password=secret
```

The example returns status `409` and renders a root form error from `createFormState(...)`.

### POST success

```txt
POST /users
name=Ada&email=ada@example.com&password=secret
```

The example redirects explicitly:

```txt
303 Location: /users/ada
```

## Ergonomic note

Current action route execution validates `action.input` before the action handler runs. That is good for API-style failures, but same-route HTML form re-rendering after input-contract failure needs explicit handling today.

This example keeps the framework unchanged: it uses `action(...)` + `projectForm(...)` for contract-native form metadata and performs the POST validation/render path explicitly in the route handler.

A future design gate could improve action HTML failure rendering ergonomics.
