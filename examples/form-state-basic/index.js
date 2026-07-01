import { optional, sigil } from '@weipertda/sigiljs';

import { action, createApp, createFormState, fail, json, ok, projectForm, redirect, route } from '../../src/index.js';

const existingEmails = new Set(['taken@example.test']);
const CreateUserInput = sigil({
  name: String,
  email: String,
  password: optional(String),
  phone: optional(String)
});

export const createUserAction = action('users.create.form-state', (ctx) => {
  const input = ctx.input || {};
  const validationIssues = validateUserInput(input);

  if (validationIssues.length > 0) {
    return fail(createFormState({
      ok: false,
      values: input,
      issues: validationIssues,
      error: {
        code: 'POTENTIA_ACTION_INPUT_FAILED',
        message: 'Action input contract failed.'
      }
    }), 400);
  }

  if (existingEmails.has(input.email)) {
    return fail(createFormState({
      ok: false,
      values: input,
      error: {
        code: 'USER_EMAIL_TAKEN',
        message: 'Email is already in use'
      }
    }), 409);
  }

  if (input.mode === 'json') {
    return ok(json(createFormState({ ok: true, value: { id: 'usr_1', email: input.email } })));
  }

  return redirect('/users', 303);
}, {
  input: CreateUserInput,
  meta: { description: 'Create a user' }
});

export const formProjection = projectForm(createUserAction);

export const app = createApp({
  routes: [
    route('POST', '/users', createUserAction)
  ]
});

function validateUserInput(input) {
  const issues = [];

  if (!input.name) {
    issues.push(issue('missing_required', 'Name is required', ['name']));
  }

  if (!input.email || !input.email.includes('@')) {
    issues.push(issue('invalid_email', 'Email must be valid', ['email']));
  }

  return issues;
}

function issue(code, message, path) {
  const field = path.join('.');
  return {
    code: code,
    message: message,
    path: path,
    field: field.length > 0 ? field : null,
    boundary: 'input',
    source: 'framework',
    expected: 'string',
    received: 'string',
    meta: null
  };
}

if (import.meta.main) {
  Bun.serve({ fetch: app.fetch, port: 3000 });
  console.log('Form state example listening on http://localhost:3000');
}
