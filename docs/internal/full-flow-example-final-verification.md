# Example App / Full Flow Pass Final Verification

## Commands run

```bash
bun test tests/full-flow-basic-example.test.js
bun run test
bun run check:release
npm pack --dry-run --json
```

Additional invariant check verified:

- package name unchanged
- version unchanged
- root export count unchanged
- forms subpath exports unchanged
- full-flow example included in package allowlist
- generated `.potentia/` output absent
- no `.jsx` / `.tsx` example files
- no frontend runtime/hydration code in example JavaScript

No publish commands were run.

## Results

### Focused smoke test

```txt
1 pass
0 fail
35 expect() calls
```

### Tests

```txt
604 pass
0 fail
1458 expect() calls
```

### Release check

```txt
604 pass
0 fail
1458 expect() calls
```

### Pack dry-run

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
```

Pack contents verified:

- includes `examples/full-flow-basic/`
- excludes `examples/full-flow-basic/.potentia/`
- excludes `docs/internal/`

## Example location

```txt
examples/full-flow-basic/
```

## Route tree

```txt
examples/full-flow-basic/
  README.md
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

## Demonstrated flow

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

Routes:

- `GET /`
- `GET /users/new`
- `POST /users`
- `GET /users/:id`

## Verified behavior

- route generation succeeds with 4 route files and 1 scope
- generated output imports from `@potentiajs/core`
- generated output has no runtime filesystem scanning
- app imports generated routes into `createApp(...)`
- `GET /` renders home HTML
- `GET /users/new` renders form HTML
- invalid URL-encoded POST renders field errors with status `400`
- safe email value is preserved after failure
- password value is omitted after failure
- domain failure renders root form error with status `409`
- success redirects with `303 Location: /users/ada`
- user detail page renders after redirect target

## Ergonomic note

Current action route execution validates `action.input` before the action handler runs. That remains unchanged. The example uses `action(...)` + `projectForm(...)` for contract-native form metadata and performs the POST validation/render path explicitly to keep same-route HTML re-rendering possible without framework redesign.

Potential future design gate:

```txt
Action HTML Failure Rendering / Form Re-Render Ergonomics
```

## Invariants verified

- no root exports changed
- no subpath exports changed
- no core behavior changed
- no JSX added
- no frontend runtime added
- no dependencies added
- full-flow example exists
- smoke test passes
- generated output not committed/present
- package contents intentional
- release blockers remain parked
- no real publish

## Remaining blockers

None for this full-flow example block.

Parked release blockers remain separate:

- npm registry visibility
- JSR version visibility
- remote CI/publish workflow failures

## Recommendation

Recommended next block:

```txt
Form Renderer Polish / Field Options Design Gate
```

Alternative:

```txt
View Layer Philosophy / HTML Component Design Gate
```

If release health is urgent:

```txt
Release Blocker Fix Pass
```
