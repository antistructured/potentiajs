# Effect DX Docs Update

## Files inspected

- `README.md`
- `docs/internal/framework-effect-model.md`
- `docs/internal/kernel-dx-polish-report.md`
- `src/index.js`

## Files changed

- `README.md`
- `docs/internal/framework-effect-model.md`
- `docs/internal/effect-dx-docs-update.md`

## README updates

The Effects section now shows helper-based usage:

```js
import { call, effect, json, ok, route } from 'potentia-js';

const loadGreeting = (name) => ({ message: `hello ${name}` });

route('GET', '/hello', effect(function* hello(ctx) {
  const greeting = yield call(loadGreeting, ctx.query.name || 'world');
  return ok(json(greeting));
}));
```

README now states:

- effects are experimental
- helpers are small command constructors
- raw command objects remain supported for compatibility
- helpers are preferred for normal usage
- advanced workflow features remain deferred

The public export list now includes:

- `effect`
- `call`
- `value`
- `context`
- `runEffect`

## Internal docs updates

`docs/internal/framework-effect-model.md` now documents:

- helper exports
- shape-stable command objects
- raw command compatibility
- validation posture
- safe public error behavior
- `delay()` deferral

## Blockers

- Public API remains experimental.
- No stable effect guide was created outside README/internal docs.
- Advanced workflow docs remain deferred because the features are not implemented.
