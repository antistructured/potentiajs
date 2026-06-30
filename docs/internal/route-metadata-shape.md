# Route Metadata Shape

## Files inspected

- `src/kernel/route.js`
- `src/kernel/route-projection.js`
- `src/kernel/route-collection.js`
- `tests/kernel-route-projection.test.js`

## Files changed

- `src/kernel/route.js`
- `src/kernel/route-projection.js`
- `tests/kernel-route-metadata.test.js`
- `tests/kernel-route-projection.test.js`
- `docs/internal/route-metadata-shape.md`

## Behavior added

Route options now formally support optional descriptive metadata:

```js
route('GET', '/users/:id', handler, {
  name: 'users.show',
  meta: { description: 'Fetch user' },
  source: { file: 'routes/users/[id].js', line: null, column: null }
});
```

Route descriptors expose:

- `name`
- `source`
- `meta`

Projection now includes:

- `name`
- `source`
- `meta`

Absent metadata projects as `null`.

## Source metadata

Source metadata is descriptive only. It is normalized to:

```js
{
  file,
  line,
  column
}
```

No filesystem inference, source line detection, or runtime import behavior was added.

## Safety behavior

Metadata is not executed. Route matching and request handling behavior are unchanged.

## Verification

```bash
bun test tests/kernel-route-metadata.test.js tests/kernel-route-projection.test.js tests/kernel-route-collection-projection.test.js tests/kernel-projection-metadata-example.test.js
```

Result:

- 29 pass
- 0 fail

## Blockers

- Route name uniqueness is not enforced by `route()`.
- Route ID collision checks are deferred to manifest creation.
