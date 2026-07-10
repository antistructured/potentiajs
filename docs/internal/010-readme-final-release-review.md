# 0.1.0 README Final Release Review

## Sections reviewed

- opening description
- current status
- install/local usage
- minimal route example
- file-routing CLI/API sections
- contract projection example
- forms renderer section
- examples list
- commands section
- current limitations
- public API status
- release/publish status

## Changes made

Updated README for final `0.1.0` posture:

- changed version label from `0.1.0-preview.1` to `0.1.0`
- replaced preview install wording with final npm install instructions
- kept Bun install instructions
- clarified `0.1.0` as first public ZeroVer foundation, not a 1.0 stability guarantee
- described PotentiaJS as server-first and contract-driven
- made the HTML-first/no-JSX law explicit in the form renderer section
- updated `createRouteManifest(... packageVersion ...)` example to `0.1.0`
- changed `check:release` wording from preview alias to release gate alias
- removed stale preview/registry-visibility wording
- added `@potentiajs/core/forms` to public subpath status
- updated release/publish status for final `0.1.0`

## Confirmed

README now clearly states:

- PotentiaJS is experimental
- `0.1.0` is the first public foundation under ZeroVer
- `0.1.0` is not a production-ready or 1.0 stability claim
- the framework is plain JavaScript
- the framework is Bun-first
- the framework is contract-driven
- the framework is server-first
- the framework is HTML-first
- JSX is intentionally not part of the official framework direction
- install uses `npm install @potentiajs/core` or `bun add @potentiajs/core`
- root import examples use `@potentiajs/core`
- file-routing import example uses `@potentiajs/core/file-routing`
- forms import example uses `@potentiajs/core/forms`
- CLI examples use `potentia routes generate` and `potentia routes check`
- full-flow example is referenced

## Blockers

None.
