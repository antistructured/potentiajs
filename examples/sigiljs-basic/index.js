import { sigil, optional } from '@weipertda/sigiljs';

import {
  createApp,
  json,
  ok,
  route
} from '../../src/index.js';

const UserParams = sigil({
  id: String
});

const UserQuery = sigil({
  include: optional(String)
});

const CreateUserBody = sigil({
  name: String
});

const UserResponse = sigil({
  id: String,
  name: String
});

export const app = createApp({
  routes: [
    route('GET', '/users/:id', (ctx) => {
      return ok(json({
        id: ctx.params.id,
        name: ctx.query.include === 'nickname' ? 'Ada Lovelace' : 'Ada'
      }));
    }, {
      params: UserParams,
      query: UserQuery,
      response: UserResponse
    }),
    route('POST', '/users', (ctx) => ok(json({
      id: 'created',
      name: ctx.body.name
    })), {
      body: CreateUserBody,
      response: UserResponse
    }),
    route('GET', '/contract-error/:id', () => ok(json({ ok: true })), {
      params: sigil({ id: Number })
    })
  ]
});

if (import.meta.main) {
  Bun.serve({
    port: 3000,
    fetch: app.fetch
  });

  console.log('Potentia SigilJS example running at http://localhost:3000');
}
