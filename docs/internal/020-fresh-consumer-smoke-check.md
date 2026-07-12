# 0.2.0 Fresh Consumer Smoke Checklist

## Goal

After the `0.2.0` publish workflow completes, verify public registry consumption from a clean project outside the repository.

This is a post-publish checklist, not an automated release-gate requirement inside the prep block.

## Temp project setup

```bash
rm -rf /tmp/potentia-020-final-consumer-smoke
mkdir /tmp/potentia-020-final-consumer-smoke
cd /tmp/potentia-020-final-consumer-smoke
npm init -y
npm install @potentiajs/core
npm ls @potentiajs/core
```

Expected installed version:

```txt
0.2.0
```

## Import smoke

Create `smoke.mjs`:

```js
import * as core from '@potentiajs/core';
import * as fileRouting from '@potentiajs/core/file-routing';
import * as forms from '@potentiajs/core/forms';
import * as html from '@potentiajs/core/html';

const requiredRoot = [
  'createApp',
  'route',
  'action',
  'projectForm',
  'createFormState'
];

const requiredHtml = [
  'html',
  'raw',
  'escapeHtml',
  'attrs',
  'fragment',
  'htmlResponse',
  'page',
  'layout'
];

for (const key of requiredRoot) {
  if (!(key in core)) throw new Error(`Missing root export: ${key}`);
}

if (!('generateFileRoutes' in fileRouting)) throw new Error('Missing file-routing export.');
if (!('renderForm' in forms)) throw new Error('Missing forms export.');

for (const key of requiredHtml) {
  if (!(key in html)) throw new Error(`Missing HTML export: ${key}`);
  if (key in core) throw new Error(`Root export polluted: ${key}`);
}

console.log(JSON.stringify({
  rootImport: true,
  fileRoutingImport: true,
  formsImport: true,
  htmlImport: true,
  rootHtmlPollution: false
}));
```

Run:

```bash
node smoke.mjs
```

## HTML API + page/layout smoke

Create `html-smoke.mjs`:

```js
import {
  html,
  raw,
  escapeHtml,
  attrs,
  fragment,
  htmlResponse,
  page,
  layout
} from '@potentiajs/core/html';

const unsafe = '<script>alert("x")</script>';
const escaped = escapeHtml(unsafe);
if (escaped !== '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;') {
  throw new Error(`Unexpected escapeHtml result: ${escaped}`);
}

const appLayout = layout(({ title, children }) => html`
  <main${attrs({ class: ['page', 'safe'] })}>
    <h1>${title}</h1>
    ${children}
  </main>
`);

const view = page({
  title: unsafe,
  body: appLayout({
    title: 'Hello',
    children: fragment('hello ', raw('<strong>world</strong>'), html`<p>${unsafe}</p>`)
  })
});

const body = String(view);
if (!body.startsWith('<!doctype html>')) throw new Error('Missing doctype.');
if (body.includes('<script>')) throw new Error('Unsafe script was not escaped.');
if (!body.includes('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;')) throw new Error('Escaped script missing.');
if (!body.includes('<strong>world</strong>')) throw new Error('raw content missing.');
if (!body.includes('class="page safe"')) throw new Error('attrs class array failed.');

const response = htmlResponse(view, { status: 201 });
if (!(response instanceof Response)) throw new Error('htmlResponse did not return Response.');
if (response.status !== 201) throw new Error(`Unexpected status: ${response.status}`);
if (response.headers.get('content-type') !== 'text/html; charset=utf-8') throw new Error('Unexpected content type.');
if ((await response.text()) !== body) throw new Error('Response body mismatch.');

console.log(JSON.stringify({
  escapeHtml: true,
  html: true,
  raw: true,
  attrs: true,
  fragment: true,
  htmlResponse: true,
  page: true,
  layout: true
}));
```

Run:

```bash
node html-smoke.mjs
```

## CLI generated routes smoke

Use the installed package CLI from the temp project:

```bash
mkdir -p routes
cat > routes/index.js <<'JS'
import { route, text } from '@potentiajs/core';

export default route('GET', '/', () => text('ok'));
JS

npx potentia routes generate --root routes --out .potentia/routes.generated.js --package @potentiajs/core --json
npx potentia routes check --root routes --out .potentia/routes.generated.js --package @potentiajs/core --json
```

Expected:

- generate exits `0`
- check exits `0`
- generated file imports `@potentiajs/core`
- no runtime filesystem scanning is required by the generated module

## Smoke coverage

This checklist covers:

- `npm install @potentiajs/core`
- root import
- file-routing import
- forms import
- html import
- page/layout import
- root non-pollution
- HTML API smoke
- page/layout smoke
- CLI generated routes smoke

## Blockers

None.
