import { sigil } from '@weipertda/sigiljs';

import { createRoutes } from '../../../../src/index.js';

const Headers = sigil({
  'x-dev-scope': String
});

export default createRoutes({
  contracts: {
    headers: (headers) => Headers.parse(headers)
  },
  hooks: {
    beforeRequest: [(ctx) => {
      ctx.headers.scope = ctx.headers['x-dev-scope'];
    }]
  },
  meta: {
    example: 'file-routing-dev'
  }
});
