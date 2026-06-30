# Framework Plugin Seam

## Files changed

- `src/kernel/plugin.js`
- `src/kernel/app.js`
- `src/index.js`
- `tests/kernel-plugin-seam.test.js`

## Public export

Added experimental export:

- `createPlugin`

## Plugin shape

The plugin seam intentionally stays small:

```js
createPlugin({
  name: 'plugin-name',
  routes: [],
  hooks: {},
  contracts: {},
  setup(ctx) {}
});
```

## Behavior

- Plugin routes compose into the app route table.
- Plugin hooks apply to plugin routes only.
- Plugin contracts apply as scoped defaults to plugin routes only.
- Plugin setup runs synchronously during app creation.
- Plugin setup receives a frozen context: `{ name, state, meta }`.
- Plugin route matching uses existing route matching semantics.
- Plugin objects and caller-owned route arrays are not mutated.

## Explicit non-goals

No plugin ecosystem was introduced:

- no async plugin loading
- no dynamic imports
- no registry
- no package discovery
- no dependency injection container
- no permissions model
- no plugin lifecycle beyond setup/routes/hooks/contracts

## Verification

```bash
bun test tests/kernel-plugin-seam.test.js tests/kernel-route-collections.test.js tests/kernel-scoped-hooks.test.js
```

Result:

- 21 pass
- 0 fail
