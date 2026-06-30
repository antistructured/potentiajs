import { describe, expect, test } from 'bun:test';

import { createApp, json, ok, projectRoute, route } from '../src/index.js';

describe('kernel route metadata', () => {
  test('route accepts optional name', () => {
    const value = route('GET', '/users/:id', () => 'ok', { name: 'users.show' });

    expect(value.name).toBe('users.show');
    expect(value.options.name).toBe('users.show');
  });

  test('route accepts optional meta', () => {
    const meta = { description: 'Fetch user' };
    const value = route('GET', '/users/:id', () => 'ok', { meta: meta });

    expect(value.meta).toBe(meta);
    expect(value.options.meta).toBe(meta);
  });

  test('route accepts optional source metadata', () => {
    const source = { file: 'routes/users/[id].js', line: null, column: null };
    const value = route('GET', '/users/:id', () => 'ok', { source: source });

    expect(value.source).toEqual(source);
    expect(value.source).not.toBe(source);
    expect(value.options.source).toBe(source);
  });

  test('route projection includes metadata', () => {
    const projection = projectRoute(route('GET', '/users/:id', () => 'ok', {
      name: 'users.show',
      meta: { description: 'Fetch user' },
      source: { file: 'routes/users/[id].js' }
    }));

    expect(projection.name).toBe('users.show');
    expect(projection.meta).toEqual({ description: 'Fetch user' });
    expect(projection.source).toEqual({ file: 'routes/users/[id].js', line: null, column: null });
  });

  test('route without metadata projects null values', () => {
    const projection = projectRoute(route('GET', '/', () => 'ok'));

    expect(projection.name).toBe(null);
    expect(projection.meta).toBe(null);
    expect(projection.source).toBe(null);
  });

  test('routing behavior is unchanged', async () => {
    const app = createApp({
      routes: [route('GET', '/users/:id', (ctx) => ok(json({ id: ctx.params.id })), {
        name: 'users.show',
        meta: { description: 'Fetch user' },
        source: { file: 'routes/users/[id].js' }
      })]
    });

    const response = await app.fetch(new Request('http://local.test/users/abc'));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ id: 'abc' });
  });

  test('metadata objects are not executed', () => {
    let ran = false;
    const metadata = {
      get description() {
        ran = true;
        return 'Fetch user';
      }
    };

    const value = route('GET', '/', () => 'ok', { meta: metadata });

    expect(value.meta).toBe(metadata);
    expect(ran).toBe(false);
  });

  test('caller-owned source metadata is not mutated', () => {
    const source = { file: 'routes/users/[id].js' };
    const value = route('GET', '/users/:id', () => 'ok', { source: source });

    expect(source).toEqual({ file: 'routes/users/[id].js' });
    expect(value.source).toEqual({ file: 'routes/users/[id].js', line: null, column: null });
  });
});
