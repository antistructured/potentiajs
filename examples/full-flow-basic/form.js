import { sigil } from '@weipertda/sigiljs';

import { action, createFormState, projectForm, redirect } from '@potentiajs/core';
import { renderForm } from '@potentiajs/core/forms';
import { html, htmlResponse, layout, page, raw } from '@potentiajs/core/html';

export const takenEmails = new Set(['taken@example.com']);

export const CreateUserInput = sigil({
  name: String,
  email: String,
  password: String
});

export const createUserAction = action('users.create.full-flow', () => null, {
  input: CreateUserInput,
  meta: { description: 'Create a user account' }
});

export const createUserForm = projectForm(createUserAction);

const appLayout = layout(({ title, children }) => html`
  <main>
    <h1>${title}</h1>
    ${children}
  </main>
`);

export function renderCreateUserPage(options = {}) {
  const state = options.state || null;
  const status = options.status || 200;
  const formHtml = renderForm(createUserForm, {
    action: '/users',
    state: state,
    submitLabel: 'Create account',
    idPrefix: 'create-user'
  });

  return htmlResponse(page({
    title: 'Create user · Potentia full flow',
    body: appLayout({
      title: 'Create a user account',
      children: html`
        <p>This page is rendered on the server from projected action metadata.</p>
        ${raw(formHtml)}
      `
    })
  }), { status });
}

export async function handleCreateUser(request) {
  const input = await parseUrlEncoded(request);
  const validation = validateCreateUserInput(input);

  if (!validation.ok) {
    return renderCreateUserPage({
      status: 400,
      state: createFormState({
        ok: false,
        values: input,
        issues: validation.issues,
        error: {
          code: 'POTENTIA_EXAMPLE_VALIDATION_FAILED',
          message: 'Please fix the highlighted fields.'
        }
      })
    });
  }

  if (takenEmails.has(input.email)) {
    return renderCreateUserPage({
      status: 409,
      state: createFormState({
        ok: false,
        values: input,
        error: {
          code: 'USER_EMAIL_TAKEN',
          message: 'Email is already in use.'
        }
      })
    });
  }

  return redirect(`/users/${slugify(input.name)}`, 303);
}

export function renderUserPage(id) {
  return htmlResponse(page({
    title: html`User ${id} · Potentia full flow`,
    body: appLayout({
      title: html`User ${id}`,
      children: html`
        <p>The account flow completed with an explicit 303 redirect.</p>
        <p><a href="/users/new">Create another user</a></p>
      `
    })
  }));
}

export function renderHomePage() {
  return htmlResponse(page({
    title: 'Potentia full flow',
    body: appLayout({
      title: 'Potentia full-flow example',
      children: html`
        <p>File routes, actions, contracts, projected forms, rendered HTML, form state, and redirects.</p>
        <p><a href="/users/new">Create a user account</a></p>
      `
    })
  }));
}

function validateCreateUserInput(input) {
  const parsed = CreateUserInput.safeParse(input);
  const issues = [];

  if (!parsed.success && parsed.error) {
    issues.push(toIssue(parsed.error));
  }

  if (!input.name) issues.push(issue('missing_required', 'Name is required.', ['name']));
  if (!input.email) {
    issues.push(issue('missing_required', 'Email is required.', ['email']));
  } else if (!input.email.includes('@')) {
    issues.push(issue('invalid_email', 'Email must include @.', ['email']));
  }
  if (!input.password) issues.push(issue('missing_required', 'Password is required.', ['password']));

  return { ok: issues.length === 0, issues: dedupeIssues(issues) };
}

function toIssue(error) {
  const path = Array.isArray(error.path) ? error.path : [];
  return issue(error.code || 'invalid_value', error.message || 'Invalid value.', path);
}

function issue(code, message, path) {
  return {
    code: code,
    message: message,
    path: path,
    field: path.length > 0 ? path.join('.') : null,
    boundary: 'input',
    source: 'framework',
    expected: 'string',
    received: 'string',
    meta: null
  };
}

function dedupeIssues(issues) {
  const seen = new Set();
  const result = [];
  for (const item of issues) {
    const key = `${item.field}:${item.code}:${item.message}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }
  return result;
}

async function parseUrlEncoded(request) {
  const text = await request.text();
  const params = new URLSearchParams(text);
  return {
    name: params.get('name') || '',
    email: params.get('email') || '',
    password: params.get('password') || ''
  };
}

function slugify(value) {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'user';
}


