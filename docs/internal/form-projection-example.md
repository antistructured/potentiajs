# Form Projection Example

## Files changed

- `examples/form-state-basic/index.js`
- `examples/form-state-basic/README.md`
- `tests/form-projection-example.test.js`
- `docs/internal/form-projection-example.md`

## Example behavior

The existing form-state example now also demonstrates metadata-only form projection.

Exports added to the example:

- `createUserAction`
- `formProjection`

`formProjection` is created with:

```js
projectForm(createUserAction)
```

The example action has a SigilJS input contract with fields for name, email, password, and phone. The projection exposes renderer-independent metadata including field names, input hints, required/optional flags, and sensitive flags.

## Scope boundaries

The example does not add:

- HTML renderer
- form generator
- frontend component
- client helper
- OpenAPI output

Server validation remains authoritative.

## Verification

`tests/form-projection-example.test.js` verifies expected field names, sensitive password metadata, input hints, and that no HTML rendering occurs.
