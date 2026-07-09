import { optional, sigil } from '@weipertda/sigiljs';

import { action, createFormState, projectForm } from '../../src/index.js';
import { renderForm } from '../../src/forms.js';

const CreateUserInput = sigil({
  name: String,
  email: String,
  password: optional(String)
});

export const createUserAction = action('users.create.rendered-form', () => ({ ok: true }), {
  input: CreateUserInput,
  meta: { description: 'Create a user from a rendered form' }
});

const baseProjection = projectForm(createUserAction);

export const formProjection = {
  ...baseProjection,
  fields: baseProjection.fields.concat([
    {
      kind: 'field',
      name: 'bio',
      path: ['bio'],
      field: 'bio',
      label: 'Bio',
      help: 'Plain text only.',
      placeholder: 'Tell us about this user',
      input: 'textarea',
      required: false,
      multiple: false,
      sensitive: false,
      options: null,
      defaultValue: null,
      contract: { kind: 'example', expected: 'string' },
      meta: null
    },
    {
      kind: 'field',
      name: 'role',
      path: ['role'],
      field: 'role',
      label: 'Role',
      help: null,
      placeholder: null,
      input: { type: 'text' },
      required: true,
      multiple: false,
      sensitive: false,
      options: ['user', { value: 'admin', label: 'Admin' }],
      defaultValue: 'user',
      contract: { kind: 'example', expected: 'string' },
      meta: null
    },
    {
      kind: 'field',
      name: 'csrf',
      path: ['csrf'],
      field: 'csrf',
      label: 'CSRF token',
      help: null,
      placeholder: null,
      input: 'hidden',
      required: true,
      multiple: false,
      sensitive: false,
      options: null,
      defaultValue: 'example-token',
      contract: { kind: 'example', expected: 'string' },
      meta: null
    }
  ])
};

export const failedState = createFormState({
  ok: false,
  values: {
    name: 'Ada Lovelace',
    email: 'not-an-email',
    password: 'secret-value-is-not-rendered',
    bio: '<curious engineer>',
    role: 'admin',
    csrf: 'posted-token'
  },
  issues: [
    {
      code: 'invalid_email',
      message: 'Email must be valid',
      path: ['email'],
      field: 'email',
      boundary: 'input',
      source: 'framework',
      expected: 'email',
      received: 'string',
      meta: null
    },
    {
      code: 'too_short',
      message: 'Bio is too short',
      path: ['bio'],
      field: 'bio',
      boundary: 'input',
      source: 'framework',
      expected: 'string',
      received: 'string',
      meta: null
    }
  ]
});

export const html = renderForm(formProjection, {
  action: '/users',
  state: failedState,
  submitLabel: 'Create user'
});

if (import.meta.main) {
  console.log(html);
}
