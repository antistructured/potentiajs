import {
  createApp,
  createFrameworkError,
  effect,
  json,
  ok,
  route,
  text
} from '../../src/index.js';

const searchQuery = {
  parse(query) {
    return {
      term: query.q || 'all',
      tags: Array.isArray(query.tag) ? query.tag : query.tag ? [query.tag] : []
    };
  }
};

const modeHeaders = {
  check(headers) {
    return headers['x-mode'] === 'example';
  }
};

const userBody = (body) => ({
  name: String(body.name).trim()
});

const userResponse = {
  check(body) {
    return typeof body.id === 'number' && typeof body.name === 'string';
  }
};

export const app = createApp({
  routes: [
    route('GET', '/', () => text('potentia kernel basic example')),
    route('GET', '/users/:id', effect(function* user(ctx) {
      const id = yield { type: 'value', value: ctx.params.id };
      return ok(json({ id }));
    })),
    route('GET', '/search', (ctx) => ok(json(ctx.query)), {
      query: searchQuery,
      headers: modeHeaders
    }),
    route('POST', '/users', (ctx) => ok(json({ id: 1, name: ctx.body.name })), {
      body: userBody,
      response: userResponse
    }),
    route('GET', '/bad-request', () => {
      throw createFrameworkError('POTENTIA_BAD_REQUEST', 'Example bad request', { status: 400, expose: true });
    })
  ]
});

if (import.meta.main) {
  Bun.serve({
    port: 3000,
    fetch: app.fetch
  });

  console.log('Potentia kernel basic example running at http://localhost:3000');
}
