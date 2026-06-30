import { sigil } from '@weipertda/sigiljs';

import { json, ok, route } from '../../../../../src/index.js';

const Params = sigil({ id: String });
const Response = sigil({ id: String, scoped: String });

export default route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id, scoped: ctx.headers.scoped })), {
  params: Params,
  response: Response
});
