# 0.2.0 Theme Selection

## Options evaluated

### A — HTML-first response/view foundation

Assessment: best fit for `0.2.0`.

Why:

- PotentiaJS already has routing, route collections, actions, forms, file-routing, and CLI generation.
- The missing application-framework connective tissue is a native way to return safe, composable HTML.
- This naturally extends the existing `@potentiajs/core/forms` renderer without requiring JSX, a compiler, client hydration, a virtual DOM, or a client runtime.
- It supports the framework identity: plain JavaScript, server-first, HTML-first, contract-native, explicit effects.

### B — App composition / plugin maturity

Assessment: valuable but deferred.

Why deferred:

- Route collections, `mount(...)`, route metadata, projection, and manifest work already provide an early composition base.
- Plugin maturity will be more useful once the application HTML surface is clearer.
- Better candidate for `0.3.0` unless framework composition becomes an adoption blocker.

### C — Resource / data conventions

Assessment: useful later.

Why deferred:

- Data/resource conventions are likely to depend on the shape of application views and response primitives.
- Adding loaders/resources before the HTML layer risks designing toward a hidden SPA/hydration model.
- Better after `0.2.0` establishes the server-rendered response surface.

### D — Dev server / watch mode

Assessment: important developer-experience work, but not the primary `0.2.0` theme.

Why deferred:

- `potentia routes generate/check` already works publicly.
- Watch/dev-server ergonomics should follow once the shape of example apps is clearer.
- It can become a targeted `0.2.x` or `0.3.0` follow-up if CLI friction becomes the top adoption blocker.

### E — Docs / adoption release

Assessment: necessary as support work, not the whole release.

Why:

- Every release needs docs/examples polish.
- A docs-only release immediately after `0.1.0` would not answer the capability question: what makes Potentia more useful as an application framework?
- Docs/examples should accompany the HTML foundation.

## Decision

Choose:

```txt
0.2.0 — HTML-first response/view foundation
```

## Primary theme

```txt
HTML-first response/view foundation
```

Goal:

- add a small, safe server-side HTML layer for plain JavaScript applications
- keep it explicit and dependency-light
- make route handlers and examples cleaner
- generalize the direction proven by form rendering

## Secondary theme

```txt
Docs/examples adoption support
```

Goal:

- add examples that demonstrate the HTML layer in real routes
- update README/CHANGELOG during implementation/release passes
- preserve ZeroVer/no-JSX/no-hydration-first framing

## Deferred

- app/plugin maturity
- resource/data conventions
- dev server/watch mode
- website/landing-page-only adoption release
- JSX/compiler/client-runtime work

## Blockers

None.
