# 0.2.0 README Final Review

## Sections reviewed

- Opening release/status framing
- Current status
- Install / local usage
- HTML-first responses
- Route composition / file-routing examples
- Contract projection examples
- Actions/forms section
- Examples list
- Current limitations
- Public API status
- Release / publish status

## Changes made

Updated README final-release posture:

- changed top-line framing from preview HTML-first layer to final `0.2.0` HTML-first response and page composition layer
- changed current version from `0.2.0-preview.0` to `0.2.0`
- changed visibility from preview foundation to HTML-first response and page composition foundation
- changed HTML helper note from `0.2.0-preview.1` to `0.2.0`
- updated route manifest example package version to `0.2.0`
- added `examples/html-basic` to the examples list
- updated full-flow example description to mention page/layout HTML responses
- updated HTML subpath export list to include `page` and `layout`
- updated release/publish status from preview prep to final `0.2.0` prep
- clarified npm `latest` post-release verification posture

## Confirmed

README now clearly states:

- PotentiaJS remains experimental and not production-ready
- `0.2.0` is not a 1.0 stability guarantee
- package install remains `npm install @potentiajs/core`
- official direction remains server-first and HTML-first
- no JSX
- no compiler
- no virtual DOM
- no client runtime
- no hydration/frontend runtime direction in current scope
- `@potentiajs/core/html` import example includes `page` and `layout`
- `htmlResponse(page(...))` is demonstrated
- escaping and `raw(...)` trust boundary are explained
- full-flow example remains referenced
- file-routing/forms examples remain accurate

## Blockers

None.
