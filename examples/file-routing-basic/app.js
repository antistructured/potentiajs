import { createApp } from '@potentiajs/core';

import routes from './.potentia/routes.generated.js';

export const app = createApp({
  routes: [routes]
});

if (import.meta.main) {
  Bun.serve({
    port: 3000,
    fetch: app.fetch
  });

  console.log('Potentia file routing example running at http://localhost:3000');
}
