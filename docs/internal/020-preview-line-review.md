# 0.2 Preview Line Review

## Preview.0

`0.2.0-preview.0` status:

- published and verified: yes
- npm version exists: yes
- JSR version exists: yes
- npm preview after preview.0 publish pointed to `0.2.0-preview.0`
- npm latest remained `0.1.0`
- public install/import smoke passed
- HTML API smoke passed for:
  - `html`
  - `raw`
  - `escapeHtml`
  - `attrs`
  - `fragment`
  - `htmlResponse`
- root remained unpolluted

Evidence:

- `docs/internal/020-preview0-final-publish-report.md`
- npm registry version list includes `0.2.0-preview.0`
- JSR registry metadata includes `0.2.0-preview.0`

## Preview.1

`0.2.0-preview.1` status:

- published and verified: yes
- npm version exists: yes
- JSR version exists: yes
- npm preview points to `0.2.0-preview.1`
- npm latest remains `0.1.0`
- public npm install smoke passed during this review
- page/layout public smoke passed during this review

Evidence:

- npm registry version list includes `0.2.0-preview.1`
- JSR registry metadata includes `0.2.0-preview.1`
- `https://jsr.io/@potentiajs/core/0.2.0-preview.1_meta.json` is reachable
- fresh temp install from `@preview` installed `0.2.0-preview.1`

## Registry state

npm dist-tags:

```json
{
  "latest": "0.1.0",
  "preview": "0.2.0-preview.1"
}
```

npm versions:

```json
[
  "0.1.0-preview.0",
  "0.1.0-preview.1",
  "0.1.0",
  "0.2.0-preview.0",
  "0.2.0-preview.1"
]
```

JSR versions:

```json
[
  "0.1.0",
  "0.1.0-preview.0",
  "0.1.0-preview.1",
  "0.2.0-preview.0",
  "0.2.0-preview.1"
]
```

## Public smoke

Fresh temp project:

```txt
/tmp/potentia-020-final-preview-line-smoke
```

Installed version:

```txt
0.2.0-preview.1
```

Smoke result:

```json
{
  "version": "0.2.0-preview.1",
  "install": true,
  "root": true,
  "fileRouting": true,
  "forms": true,
  "html": true,
  "pageLayout": true,
  "rootPollution": false
}
```

## Final promotion justification

The preview line is clean:

- preview.0 low-level HTML foundation published and verified
- preview.1 page/layout integration published and verified
- npm preview points to the last preview
- npm latest remains the previous final release
- JSR sees both preview versions
- fresh public install/import/page-layout smoke passes

## Blockers

None.
