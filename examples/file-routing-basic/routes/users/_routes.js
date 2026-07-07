import { createRoutes } from '@potentiajs/core';

export default createRoutes({
  hooks: {
    afterResponse: [(ctx, response) => {
      response.headers.set('x-file-routing-scope', 'users');
      response.headers.set('x-file-routing-path', ctx.path);
      return response;
    }]
  },
  meta: {
    example: 'file-routing-basic',
    scope: 'users'
  }
});
