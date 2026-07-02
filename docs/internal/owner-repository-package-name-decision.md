# Owner Repository / Package Name Decision

## Current package name

```txt
potentia-js
```

## Current repository metadata

```txt
git+https://github.com/antistructured/poteniajs.git
```

Related URLs:

```txt
https://github.com/antistructured/poteniajs/issues
https://github.com/antistructured/poteniajs#readme
```

## Owner decision

Decision: **decided, pending external rename/availability checks**.

Repository slug:

```txt
antistructured/potentiajs
```

The current metadata/remote path `poteniajs` is not the intended public slug and should be corrected before public preview.

npm package name:

```txt
potentiajs
```

Fallback npm package name if unscoped `potentiajs` is unavailable:

```txt
@weipertda/potentiajs
```

## Future changes

During Final Public Preview Release Prep after external checks:

1. Update GitHub repository / remote to `https://github.com/antistructured/potentiajs.git` if not already renamed externally.
2. Update `package.json`:
   - `name`: `potentiajs`, or fallback `@weipertda/potentiajs`
   - `repository.url`: matching chosen GitHub URL
   - `bugs.url`: matching chosen GitHub URL
   - `homepage`: matching chosen GitHub URL
3. Update README import/install examples from `potentia-js` to the chosen package name.
4. Update examples/tests that intentionally reference package-name strings.
5. Rerun packed artifact install smoke.

## Remaining external checks

- Confirm the GitHub repo is renamed or available at `antistructured/potentiajs`.
- Check npm availability for `potentiajs`.
- If unavailable, use `@weipertda/potentiajs`.

## Blocked changes in this decision-capture block

- No package name change here.
- No repository metadata change here.
- No remote rename here.
