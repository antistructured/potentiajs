import { json, ok, route } from '@potentiajs/core';

export default route('GET', '/:id', (ctx) => ok(json({
  id: ctx.params.id,
  from: 'file-routing-basic'
})));
