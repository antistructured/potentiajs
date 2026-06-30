import { sigil } from '@weipertda/sigiljs';

import { createRoutes } from '../../../../../src/index.js';

const Headers = sigil({
  'x-scope': String
});

export default createRoutes({
  contracts: {
    headers: (headers) => Headers.parse(headers)
  },
  hooks: {
    beforeRequest: [(ctx) => {
      ctx.headers.scoped = ctx.headers['x-scope'];
    }]
  },
  meta: {
    name: 'users'
  }
});
