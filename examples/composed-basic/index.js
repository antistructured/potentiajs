import { sigil, optional } from '@weipertda/sigiljs';

import {
  call,
  createApp,
  createPlugin,
  createRoutes,
  effect,
  json,
  mount,
  ok,
  route
} from '../../src/index.js';

const AuthHeaders = sigil({
  'x-auth': String
});

const UserParams = sigil({
  id: String
});

const UserQuery = sigil({
  include: optional(String)
});

const UserBody = sigil({
  name: String
});

const UserResponse = sigil({
  id: String,
  name: String
});

function displayName(include) {
  return include === 'full' ? 'Ada Lovelace' : 'Ada';
}

const userRoutes = createRoutes({
  prefix: '/users',
  contracts: {
    headers: AuthHeaders
  },
  hooks: {
    beforeRequest: [(ctx) => {
      ctx.state.audit.push(`before:${ctx.path}`);
    }],
    afterResponse: [(ctx, response) => {
      response.headers.set('x-composed-example', 'yes');
      return response;
    }]
  },
  routes: [
    route('GET', '/', () => ok(json({ users: [] })), {
      name: 'users.index',
      meta: { description: 'List users' },
      source: { file: 'examples/composed-basic/index.js' }
    }),
    route('GET', '/:id', effect(function* getUser(ctx) {
      const name = yield call(displayName, ctx.query.include);
      return ok(json({
        id: ctx.params.id,
        name: name
      }));
    }), {
      name: 'users.show',
      meta: { description: 'Fetch a user by id' },
      source: { file: 'examples/composed-basic/index.js' },
      params: UserParams,
      query: UserQuery,
      response: UserResponse
    }),
    route('POST', '/', (ctx) => ok(json({
      id: 'created',
      name: ctx.body.name
    })), {
      name: 'users.create',
      meta: { description: 'Create a user' },
      source: { file: 'examples/composed-basic/index.js' },
      body: UserBody,
      response: UserResponse
    })
  ]
});

const healthPlugin = createPlugin({
  name: 'health',
  routes: [route('GET', '/health', () => ok(json({ ok: true })))]
});

export const app = createApp({
  state: { audit: [] },
  routes: [
    route('GET', '/', () => ok(json({ ok: true }))),
    mount(userRoutes, { prefix: '/api' })
  ],
  plugins: [healthPlugin]
});

if (import.meta.main) {
  Bun.serve({
    port: 3000,
    fetch: app.fetch
  });

  console.log('Potentia composed example running at http://localhost:3000');
}
