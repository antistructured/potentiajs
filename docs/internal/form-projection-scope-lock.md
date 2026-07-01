# Form Projection Scope Lock

## Files inspected

- `package.json`
- `README.md`
- `src/kernel/contract-projection.js`
- `src/kernel/action-projection.js`
- `src/kernel/route-manifest.js`
- `src/kernel/form-state.js`
- `tests/kernel-form-state-values.test.js`
- `tests/kernel-form-state-errors.test.js`
- `tests/kernel-form-state-helper.test.js`
- `examples/form-state-basic/`
- `docs/internal/form-state-helper-foundation-report.md`
- `docs/internal/form-state-projection-manifest-decision.md`
- `docs/internal/contract-projection-upgrade-report.md`
- `docs/internal/route-metadata-manifest-foundation-report.md`

## Files changed

- `docs/internal/form-projection-scope-lock.md`

## Findings

Current foundations support a future form projection layer, but no form projection implementation exists yet.

Current contract projection shape:

```js
{
  kind,
  capabilities,
  capability,
  opaque,
  schema,
  fields,
  required,
  optional,
  meta
}
```

Current action projection shape:

```js
{
  kind: 'action',
  id,
  input,
  output,
  result,
  source,
  meta
}
```

Current route manifest action entries include action id, route id, method/path, input/output projection, result semantics, JSON + URL-encoded content types, and progressive-enhancement metadata. They do not include `form` metadata.

Current form state behavior is runtime-only and opt-in through `createFormState(...)`. It preserves safe parsed values, omits sensitive fields, groups issues by field, maps root issues to `_form`, and preserves default action behavior.

## Decisions

Form projection should be a metadata layer, not rendering.

Future form projection should be both:

1. **Action-based** for normal usage, because action input contracts provide the meaningful form boundary and action id.
2. **Contract-based** as a lower-level helper later, because contract field metadata can be projected independently when safe.

The primary future API candidate is:

```js
projectForm(action, options)
```

A lower-level contract projection helper may follow later, but should not be the first public surface unless implementation evidence proves it is useful.

Projection must not execute handlers, hooks, contracts, validators, or user code.

SigilJS metadata can support object fields, required/optional fields, primitive kinds, nested fields, and JSON Schema fallback where available. Generic function/parse/check contracts remain opaque.

## Deferred

- source implementation
- new exports
- form renderer
- HTML generator
- frontend runtime
- client SDK
- OpenAPI
- manifest `forms` metadata
- multipart/file projection
- session/flash helpers
- DB/auth
- CLI/compiler
- TypeScript conversion
- publish prep

## Blockers

- SigilJS field metadata is limited to what `describe()` / `toJSONSchema()` safely expose.
- Generic contracts are intentionally opaque and cannot produce trustworthy fields.
- Labels/help/placeholders/options/sensitive overrides require future explicit metadata conventions.
