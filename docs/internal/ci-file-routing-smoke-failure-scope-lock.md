# CI File Routing Smoke Failure Scope Lock

## Files inspected

- `tests/file-routing-dev-workflow-example.test.js` (requested name; not present locally)
- `tests/file-routing-dev-example.test.js`
- `tests/file-routing-generated-smoke.test.js`
- `tests/file-routing-basic-example.test.js`
- `examples/file-routing-dev/`
- `examples/file-routing-basic/`
- `src/dev/file-routing/`
- `src/file-routing.js`
- `package.json`
- `.github/workflows/publish.yml`

## Exact failing tests from remote

Remote reported failures:

```txt
file routing dev workflow example > generates routes and consumes them explicitly through the example app
file routing generated smoke > scan → generate → import → createApp serves projected routes
```

Local file mapping:

- remote `file routing dev workflow example` maps to `tests/file-routing-dev-example.test.js`
- remote `file routing generated smoke` maps to `tests/file-routing-generated-smoke.test.js`

## Local vs CI mismatch

Remote historical failure count:

```txt
555 pass
2 fail
1161 expect() calls
```

Recent local branch state before this pass was higher because multiple subsequent blocks added renderer/full-flow tests:

```txt
609 pass
0 fail
1486 expect() calls
```

This mismatch suggests the remote failure is from an older commit or workflow run with stale file-routing assumptions.

## Suspected root cause

Historical file-routing generated smoke previously referenced old package identity:

```txt
potentiajs
```

Current correct package identity:

```txt
@potentiajs/core
```

Current correct file-routing subpath:

```txt
@potentiajs/core/file-routing
```

Current generated output should import:

```js
import { createRoutes, mount } from '@potentiajs/core';
```

## Scope

This pass is isolated to file-routing smoke/tests/examples/workflow verification.

In scope:

- active stale package identity search
- generated smoke expectation verification
- dev workflow example verification
- local reproduction of the two failing tests
- full local release checks
- workflow command alignment check

Out of scope:

- publish commands
- version bump
- package API changes
- renderer changes
- frontend/runtime/compiler work
- new file-routing features

## Acceptance

Failure scope is isolated to active file-routing smoke/tests/examples and workflow verification.

## Blockers

None.
