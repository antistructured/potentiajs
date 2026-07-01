# Action Basic Example

Focused smoke example for Potentia's experimental `action()` primitive.

Demonstrates:

- `action()`
- JSON input
- URL-encoded input from plain-form-compatible submissions
- `ctx.input`
- SigilJS input contract
- SigilJS output contract
- successful action result with `ok(json(...))`
- intentional domain failure with `fail({ code, message }, status)`
- explicit redirect after successful action with `redirect('/users', 303)`
- explicit `route('POST', '/users', createUser)` delivery
- `effect(...)` with `call(...)`
- deterministic validation failure

Plain HTML form submissions can target the same action route:

```html
<form method="post" action="/users">
  <input name="name">
  <input name="email">
  <button>Create</button>
</form>
```

A redirect-after-success route is also available at `POST /users/redirect`.

No form helper, frontend runtime, client JS, multipart support, client SDK, or OpenAPI generator is implemented here.
