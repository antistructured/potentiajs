# 0.2.0-preview.0 Fresh npm Install + Import Smoke

## Temp project

```txt
/tmp/potentia-020-preview0-install-smoke
```

## Commands run

```bash
rm -rf /tmp/potentia-020-preview0-install-smoke
mkdir /tmp/potentia-020-preview0-install-smoke
cd /tmp/potentia-020-preview0-install-smoke
npm init -y
npm install @potentiajs/core@preview
npm ls @potentiajs/core
node smoke.mjs
```

## Install

Installed version:

```txt
0.2.0-preview.0
```

`npm ls`:

```txt
potentia-020-preview0-install-smoke@1.0.0 /tmp/potentia-020-preview0-install-smoke
└── @potentiajs/core@0.2.0-preview.0
```

## Imports

`node smoke.mjs`:

```json
{
  "version": "0.2.0-preview.0",
  "rootImport": true,
  "fileRoutingImport": true,
  "formsImport": true,
  "htmlImport": true,
  "rootHtmlPollution": false
}
```

Confirmed:

- root import works
- file-routing import works
- forms import works
- HTML import works

## Root pollution

Confirmed no HTML helper is root-exported.

## Blockers

None.
