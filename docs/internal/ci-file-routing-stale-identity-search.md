# CI File Routing Stale Identity Search

## Active search scope

Searched active automation/runtime scopes only:

- `tests/`
- `examples/`
- `scripts/`
- `.github/workflows/`
- `src/dev/file-routing/`

Historical internal docs were intentionally not mass-edited because they do not affect automation.

## Patterns searched

```txt
from 'potentiajs'
from "potentiajs"
packageName: 'potentiajs'
packageName: "potentiajs"
@potentia/core
@weipertda/potentiajs
poteniajs
```

## Results

No active matches were found in the searched scopes.

## Patches

No stale active package identity references required patching.

Current active file-routing expectations already use:

```txt
@potentiajs/core
@potentiajs/core/file-routing
```

## Acceptance

No active test/example/workflow references old package identity.

## Blockers

None.
