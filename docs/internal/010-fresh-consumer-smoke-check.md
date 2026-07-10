# 0.1.0 Fresh Consumer Smoke Check

## Approach

Documentation checklist, not a committed script.

Rationale:

- The smoke verifies public registry state after publish, so it should run after the publish workflow completes.
- A committed local script would be brittle before the exact version is available on public npm/JSR.
- The existing post-publish registry verification docs already proved this flow for preview releases.

## Temp project setup

Use a clean project outside this repository:

```bash
SMOKE=/tmp/potentia-010-public-smoke
rm -rf "$SMOKE"
mkdir -p "$SMOKE"
cd "$SMOKE"
npm init -y
npm pkg set type=module
npm install @potentiajs/core@0.1.0
```

## Verify installed package

```bash
npm ls @potentiajs/core
node -e "console.log(require('./node_modules/@potentiajs/core/package.json').version)"
test -x node_modules/.bin/potentia
```

Expected:

```txt
@potentiajs/core@0.1.0
node_modules/.bin/potentia exists
```

## Import smoke

Create `smoke.mjs`:

```js
import * as core from '@potentiajs/core';
import * as fileRouting from '@potentiajs/core/file-routing';
import * as forms from '@potentiajs/core/forms';

const requiredCore = [
  'createApp',
  'route',
  'action',
  'projectForm',
  'createFormState'
];

for (const key of requiredCore) {
  if (!(key in core)) throw new Error(`Missing core export: ${key}`);
}

if (!('generateFileRoutes' in fileRouting)) throw new Error('Missing file-routing export');
if (!('renderForm' in forms)) throw new Error('Missing forms export');
if ('generateFileRoutes' in core) throw new Error('Root polluted: generateFileRoutes');
if ('renderForm' in core) throw new Error('Root polluted: renderForm');

console.log(JSON.stringify({
  core: requiredCore.length,
  fileRouting: Object.keys(fileRouting),
  forms: Object.keys(forms),
  rootHasGenerateFileRoutes: 'generateFileRoutes' in core,
  rootHasRenderForm: 'renderForm' in core
}));
```

Run:

```bash
node smoke.mjs
```

## CLI smoke

Create route files:

```bash
mkdir -p routes/users
cat > routes/index.js <<'JS'
import { ok, route, text } from '@potentiajs/core';

export default route('GET', '/', () => ok(text('home')));
JS

cat > routes/users/[id].js <<'JS'
import { json, ok, route } from '@potentiajs/core';

export default route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id })));
JS
```

Run:

```bash
./node_modules/.bin/potentia routes check --json
./node_modules/.bin/potentia routes generate --json
./node_modules/.bin/potentia routes check --json
```

Expected:

- first check exits `1` with status `missing`
- generate exits `0` with status `generated`
- second check exits `0` with status `current`
- `.potentia/routes.generated.js` exists

## Generated app smoke

Create `app-smoke.mjs`:

```js
import { createApp } from '@potentiajs/core';
import routes from './.potentia/routes.generated.js';

const app = createApp({ routes: [routes] });
const root = await app.fetch(new Request('http://localhost/'));
const user = await app.fetch(new Request('http://localhost/users/ada'));

console.log(JSON.stringify({
  rootStatus: root.status,
  rootBody: await root.text(),
  userStatus: user.status,
  userBody: await user.json()
}));
```

Run:

```bash
node app-smoke.mjs
```

Expected:

```json
{
  "rootStatus": 200,
  "rootBody": "home",
  "userStatus": 200,
  "userBody": { "id": "ada" }
}
```

## Form renderer smoke

Use the import smoke to confirm `renderForm` exists, or add a minimal `projectForm(...)` + `renderForm(...)` smoke mirroring `examples/form-rendering-basic/`.

## Smoke coverage

This checklist covers:

- fresh install
- root import
- file-routing import
- forms import
- CLI binary
- routes check/generate/check
- generated routes app usage
- root export cleanliness

## Blockers

None.
