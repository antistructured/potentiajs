import { json, ok, route } from '../../../../src/index.js';

export default route('GET', '/:id', (ctx) => ok(json({ id: ctx.params.id, scope: ctx.headers.scope })));
