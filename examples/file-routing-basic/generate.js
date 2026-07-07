import { generateFileRoutes } from '@potentiajs/core/file-routing';

export async function generate() {
  const result = await generateFileRoutes({
    rootDir: new URL('./routes', import.meta.url).pathname,
    outputFile: new URL('./.potentia/routes.generated.js', import.meta.url).pathname
  });

  if (!result.ok) {
    const details = result.errors.map((error) => `${error.code}: ${error.message}`).join('\n');
    throw new Error(`File route generation failed:\n${details}`);
  }

  return result;
}

if (import.meta.main) {
  const result = await generate();
  console.log(`generated ${result.routes} route files and ${result.scopes} route scopes`);
  console.log(result.outputFile);
}
