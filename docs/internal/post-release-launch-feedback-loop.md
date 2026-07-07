# Post-Release Launch / Feedback Loop

## Purpose

Prepare lightweight launch and feedback assets without adding public files or starting a broad marketing push before registry visibility is fixed.

## 1. Short launch announcement

PotentiaJS public preview is here: an experimental Bun-first JavaScript framework kernel for contract-driven routing, server actions, explicit effects, normalized diagnostics, and form metadata.

It is intentionally small and experimental: no frontend runtime, no form renderer, no client SDK, no OpenAPI generator, and no stable API promise yet. The goal of this preview is feedback on the foundation: contracts as source of truth, server-authoritative actions, and renderer-independent form state/projection.

## 2. Longer technical launch post

PotentiaJS is an experiment in making runtime contracts the backbone of a web framework rather than a validation afterthought.

The first public preview focuses on a small plain-JavaScript core:

- explicit routing and route composition
- SigilJS runtime contract boundaries
- structured effect descriptors
- server actions with JSON and URL-encoded input
- safe `ctx.input` handling
- normalized field-level diagnostics
- `createFormState(...)` for failed form submissions
- `projectForm(...)` for renderer-independent form metadata
- route/action/contract/manifest projection helpers
- focused examples and package smoke coverage

What is deliberately not included:

- stable API commitment
- frontend runtime or hydration
- form renderer/generator
- client SDK
- OpenAPI generator
- ORM/auth/session layer
- multipart/file uploads
- public file-routing API

The preview question is not “is this production-ready?” It is not. The question is whether the model is useful: contracts define application shape, actions stay server-authoritative, effects are explicit, diagnostics are normalized, and forms can be understood before they are rendered.

## 3. First feedback request

If you try PotentiaJS, I’m looking for feedback on the foundation:

1. Does the contract/action/form-state model make sense?
2. Are the examples enough to understand the framework?
3. Is the root API too broad?
4. What feels missing before you would try it in a side project?
5. Should form rendering live in core or stay separate?
6. Does metadata projection feel useful, or too abstract?
7. Are diagnostics shaped the way you would want for forms/tooling?

## 4. Known limitations list

- APIs are experimental.
- No stable API commitment.
- No frontend runtime.
- No renderer/form generator.
- No client SDK.
- No OpenAPI generator.
- No ORM/auth/session integration.
- No multipart/file upload support.
- No session/flash helpers.
- Public file-routing API is not ready.
- JSR has no visible version yet.
- npm registry visibility is currently blocked in verification.
- CI/publish workflow had recent failures and needs hardening.

## 5. Next milestone candidates

- Release blocker fix / publish completion pass.
- Public preview patch release prep, if the stale docs/package state reached a registry artifact.
- Trusted Publishing / JSR Automation Hardening.
- Post-release distribution kit once registry visibility is clean.
- File Routing Public API Design Gate.
- Form Rendering Design Gate.
- Docs/site landing page.
- Example app walkthrough.

## 6. Issue triage labels recommendation

Suggested labels:

- `preview-feedback`
- `bug`
- `docs`
- `release-blocker`
- `registry`
- `ci`
- `jsr`
- `forms`
- `actions`
- `contracts`
- `routing`
- `projection`
- `question`
- `design-gate`

## 7. Release monitoring checklist

Before broad sharing:

- npm package page is visible.
- npm install from a clean temp project passes.
- JSR package has a visible version or is explicitly deferred.
- README on registry uses the correct package name.
- GitHub release install command matches the registry package.
- CI is green on the release/fix commit.
- Publish workflow is manual/protected and cannot publish on every push.
- Any patch-release need is decided.

After sharing:

- Watch npm/JSR install issues.
- Watch GitHub issues/discussions for API confusion.
- Track docs questions separately from runtime bugs.
- Label all preview feedback.
- Collect repeated questions into README/docs updates.

## Public files decision

No public files were created in this block. Potential future files:

- `CONTRIBUTING.md`
- `SECURITY.md`
- GitHub issue templates
- `docs/roadmap.md`

These should wait until the registry release path is clean.

## Blockers

Do not broadly announce until registry visibility and install smoke pass.

## Publish status

No second publish occurred.
