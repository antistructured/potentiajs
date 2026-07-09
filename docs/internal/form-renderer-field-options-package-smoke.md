# Form Renderer Field Options Package Smoke

## Files inspected

- `package.json`
- `src/forms.js`
- packed local artifact
- installed temp-project renderer output

## Files changed

- `docs/internal/form-renderer-field-options-package-smoke.md`

## Pack

Pack artifact result:

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
filename: potentiajs-core-0.1.0-preview.0.tgz
```

Dry-run result before artifact smoke:

```txt
package: @potentiajs/core
version: 0.1.0-preview.0
entry count: 70
includes docs/internal/: no
```

## Installed smoke

A temp project installed the locally packed tarball and imported:

```js
import { renderForm } from '@potentiajs/core/forms';
```

The smoke rendered a projection containing:

- textarea field
- hidden field
- select field
- field help
- field error state
- sensitive password field

Smoke checks passed:

```json
{
  "textarea": true,
  "hidden": true,
  "select": true,
  "dataAttributes": true,
  "ariaDescribedBy": true,
  "ariaInvalid": true,
  "escaped": true,
  "sensitive": true
}
```

## Cleanup status

Temporary pack and install directories were removed.

## Publish status

No publish command was run.

## Blockers

None.
