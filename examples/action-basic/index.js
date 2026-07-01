import { sigil } from '@weipertda/sigiljs';
import { action, call, createApp, effect, fail, json, ok, redirect, route } from '../../src/index.js';

const CreateUserInput = sigil({
  name: String,
  email: String
});

const CreateUserOutput = sigil({
  id: String,
  name: String,
  email: String
});

function insertUser(input) {
  if (input.email === 'taken@example.test') {
    return null;
  }

  return {
    id: 'usr_1',
    name: input.name,
    email: input.email
  };
}

export const createUser = action('users.create', effect(function* createUser(ctx) {
  const user = yield call(insertUser, ctx.input);
  if (!user) return fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409);

  return ok(json(user));
}), {
  input: CreateUserInput,
  output: CreateUserOutput,
  meta: { description: 'Create a user from JSON or URL-encoded action input' },
  source: { file: 'examples/action-basic/index.js' }
});

export const createUserAndRedirect = action('users.create.redirect', effect(function* createUserAndRedirect(ctx) {
  const user = yield call(insertUser, ctx.input);
  if (!user) return fail({ code: 'USER_EMAIL_TAKEN', message: 'Email is already in use' }, 409);

  return redirect('/users', 303);
}), {
  input: CreateUserInput,
  meta: { description: 'Create a user and redirect after success' },
  source: { file: 'examples/action-basic/index.js' }
});

export const app = createApp({
  routes: [
    route('POST', '/users', createUser),
    route('POST', '/users/redirect', createUserAndRedirect)
  ]
});

if (import.meta.main) {
  Bun.serve({ fetch: app.fetch });
}
