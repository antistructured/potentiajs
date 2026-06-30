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
  const htmlMatch = source.match(/html:\s*([\s\S]+)/);
  const name = nameMatch?.[1] ?? 'AnonymousView';
  const html = (htmlMatch?.[1] ?? '').trim();

  let propsCode = '';
  if (stateDef) {
    const states = stateDef.split(/\n|;/).filter(Boolean);
    stateCode = states.map(s => `const ${s.trim()};`).join('\n');
  }

  const renderFn = `export function render_${name}(props) {
    \n${propsCode}\n${stateCode}\nreturn \`${html.replace(/\{(\w+)\}/g, '${$1}') }\`;\n}`;

  return renderFn;
}
