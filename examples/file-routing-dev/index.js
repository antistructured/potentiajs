import { createApp } from '../../src/index.js';
import generatedRoutes from './.potentia/routes.generated.js';

export const app = createApp({
  routes: [generatedRoutes]
});
