export function compileDSL() {
  return {
    name: 'compile-view-dsl',
    setup(build) {
      build.onLoad({ filter: /\.view$/ }, async (args) => {
        const content = await Bun.file(args.path).text();
        const compiled = compileViewFile(content);
        return {
          contents: compiled,
          loader: 'js',
        };
      });
    },
  };
}

function compileViewFile(source) {
  // Very basic preprocessor: converts .view into an exported render function
  const nameMatch = source.match(/view\s+(\w+)/);
  const propsMatch = source.match(/props:\s*\{([\s\S]*?)\}/);
  const stateMatch = source.match(/state:\s*\{([\s\S]*?)\}/);
  const htmlMatch = source.match(/html:\s*([\s\S]+)/);

  const name = nameMatch?.[1] ?? 'AnonymousView';
  const propsDef = propsMatch?.[1]?.trim() || '';
  const stateDef = stateMatch?.[1]?.trim() || '';
  const html = (htmlMatch?.[1] ?? '').trim();

  let propsCode = '';
  if (propsDef) {
    const props = propsDef.split(/\s+/).filter(Boolean);
    propsCode = props.map(p => `const ${p.split(':')[0]} = props.${p.split(':')[0]};`).join('\n');
  }

  let stateCode = '';
  if (stateDef) {
    const states = stateDef.split(/\n|;/).filter(Boolean);
    stateCode = states.map(s => `const ${s.trim()};`).join('\n');
  }

  const renderFn = `export function render_${name}(props) {
    ${propsCode}
    ${stateCode}
    return \`${html.replace(/\{(\w+)\}/g, '${$1}') }\`;
  }`;

  return renderFn;
}
