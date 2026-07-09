import { describe, expect, test } from 'bun:test';
import { optional, sigil } from '@weipertda/sigiljs';

import { action, createFormState, projectForm } from '../src/index.js';
import { renderForm } from '../src/forms.js';

describe('form HTML renderer', () => {
  test('forms subpath import works and root export does not include renderForm', async () => {
    const forms = await import('@potentiajs/core/forms');
    const root = await import('../src/index.js');

    expect(typeof forms.renderForm).toBe('function');
    expect(Object.keys(forms)).toEqual(['renderForm']);
    expect(root.renderForm).toBeUndefined();
  });

  test('renders simple projected fields', () => {
    const form = projectForm(action('users.create', () => 'ok', {
      input: sigil({ email: String, password: optional(String), age: Number, subscribed: Boolean })
    }));
    const html = renderForm(form, { action: '/users' });

    expect(html).toContain('<form method="POST" action="/users" enctype="application/x-www-form-urlencoded" data-potentia-form="users.create">');
    expect(html).toContain('data-potentia-label="email" for="users-create-email"');
    expect(html).toContain('data-potentia-control="email" id="users-create-email" name="email" type="email" required autocomplete="email"');
    expect(html).toContain('data-potentia-control="password" id="users-create-password" name="password" type="password"');
    expect(html).toContain('data-potentia-control="age" id="users-create-age" name="age" type="number" required');
    expect(html).toContain('data-potentia-control="subscribed" id="users-create-subscribed" name="subscribed" type="checkbox" required value="true"');
    expect(html).toContain('<button type="submit" data-potentia-submit>Submit</button>');
  });

  test('escapes dynamic form, field, and value content', () => {
    const form = {
      kind: 'form',
      id: 'bad<form>',
      method: 'post',
      encType: 'application/x-www-form-urlencoded',
      opaque: false,
      fields: [{
        kind: 'field',
        name: 'title"><script>',
        field: 'title"><script>',
        label: 'Title <script>alert(1)</script>',
        help: 'Help & details',
        placeholder: 'Type "here"',
        input: { type: 'text' },
        required: true,
        sensitive: false,
        multiple: false,
        options: null,
        defaultValue: '<b>unsafe</b>'
      }],
      errors: { rootKey: '_form' }
    };
    const html = renderForm(form, { action: '/submit?next=<script>', submitLabel: '<Save>' });

    expect(html).toContain('action="/submit?next=&lt;script&gt;"');
    expect(html).toContain('data-potentia-form="bad&lt;form&gt;"');
    expect(html).toContain('Title &lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('placeholder="Type &quot;here&quot;"');
    expect(html).toContain('value="&lt;b&gt;unsafe&lt;/b&gt;"');
    expect(html).toContain('Help &amp; details');
    expect(html).toContain('&lt;Save&gt;');
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<b>unsafe</b>');
  });

  test('renders state values and errors without mutating state', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String, password: String }) }));
    const state = createFormState({
      ok: false,
      values: { email: 'ada@example.test', password: 'secret' },
      issues: [
        issue('email', 'Email <invalid>'),
        issue('email', 'Email required'),
        issue(null, 'Root & failure')
      ]
    });
    const before = JSON.stringify(state);
    const html = renderForm(form, { action: '/users', state: state });

    expect(JSON.stringify(state)).toBe(before);
    expect(html).toContain('value="ada@example.test"');
    expect(html).not.toContain('secret');
    expect(html).toContain('<div data-potentia-form-errors>');
    expect(html).toContain('Root &amp; failure');
    expect(html.indexOf('Email &lt;invalid&gt;')).toBeLessThan(html.indexOf('Email required'));
    expect(html).toContain('data-potentia-errors-for="email"');
  });

  test('renders checkbox checked from state', () => {
    const form = projectForm(action('settings.update', () => 'ok', { input: sigil({ subscribed: Boolean }) }));
    const state = createFormState({ ok: true, values: { subscribed: true }, issues: [] });
    const html = renderForm(form, { action: '/settings', state: state });

    expect(html).toContain('type="checkbox" required value="true" checked');
  });

  test('supports method submitLabel and idPrefix options', () => {
    const form = projectForm(action('search.form', () => 'ok', { input: sigil({ q: String }) }), { method: 'GET' });
    const html = renderForm(form, { action: '/search', method: 'get', submitLabel: 'Search now', idPrefix: 'custom id' });

    expect(html).toContain('<form method="GET" action="/search"');
    expect(html).toContain('id="custom-id-q"');
    expect(html).toContain('<button type="submit" data-potentia-submit>Search now</button>');
  });

  test('unsupported methods and enctype fall back safely', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }), { method: 'DELETE', encType: 'multipart/form-data' });
    const html = renderForm(form, { action: '/users' });

    expect(html).toContain('<form method="POST" action="/users" enctype="application/x-www-form-urlencoded"');
  });

  test('renders options as select and multiple values deterministically', () => {
    const form = {
      kind: 'form',
      id: 'preferences',
      method: 'POST',
      encType: 'application/x-www-form-urlencoded',
      opaque: false,
      fields: [
        field({ name: 'role', label: 'Role', options: [{ value: 'admin', label: 'Admin <User>' }, { value: 'member', label: 'Member' }] }),
        field({ name: 'tags', label: 'Tags', multiple: true })
      ],
      errors: { rootKey: '_form' }
    };
    const state = createFormState({ ok: false, values: { role: 'admin', tags: ['alpha', 'beta'] }, issues: [] });
    const html = renderForm(form, { action: '/preferences', state: state });

    expect(html).toContain('<select data-potentia-control="role" id="preferences-role" name="role" required>');
    expect(html).toContain('<option value="admin" selected>Admin &lt;User&gt;</option>');
    expect(html).toContain('data-potentia-control="tags" id="preferences-tags-1" name="tags" type="text" required value="alpha"');
    expect(html).toContain('data-potentia-control="tags" id="preferences-tags-2" name="tags" type="text" required value="beta"');
  });

  test('opaque and invalid projections render safe message', () => {
    const opaque = projectForm(action('opaque.form', () => 'ok', { input: { check: () => true } }));
    const opaqueHtml = renderForm(opaque, { action: '/target' });
    const invalidHtml = renderForm(null, { action: '/target' });

    expect(opaqueHtml).toContain('data-potentia-form-error="opaque"');
    expect(opaqueHtml).toContain('This form cannot be rendered from opaque metadata.');
    expect(opaqueHtml).not.toContain('<button');
    expect(invalidHtml).toContain('data-potentia-form-error="opaque"');
  });

  test('does not support raw HTML bypass options', () => {
    const form = projectForm(action('users.create', () => 'ok', { input: sigil({ email: String }) }));
    const html = renderForm(form, { action: '/users', submitLabel: '<strong>Create</strong>', unsafeHtml: true });

    expect(html).toContain('&lt;strong&gt;Create&lt;/strong&gt;');
    expect(html).not.toContain('<strong>Create</strong>');
  });

  test('renders textarea from explicit string and object input metadata', () => {
    const form = formWithFields([
      field({ name: 'bio', label: 'Bio', input: 'textarea', placeholder: 'Tell us', help: 'Use plain text.' }),
      field({ name: 'notes', label: 'Notes', input: { type: 'textarea' }, defaultValue: '<b>default</b>' }),
      field({ name: 'description', label: 'Description', defaultValue: 'long '.repeat(20) })
    ]);
    const state = createFormState({ ok: false, values: { bio: '<script>safe text</script>' }, issues: [] });
    const html = renderForm(form, { action: '/profile', state: state });

    expect(html).toContain('<textarea data-potentia-control="bio" id="example-bio" name="bio" required placeholder="Tell us" aria-describedby="example-bio-help">&lt;script&gt;safe text&lt;/script&gt;</textarea>');
    expect(html).toContain('<textarea data-potentia-control="notes" id="example-notes" name="notes" required>&lt;b&gt;default&lt;/b&gt;</textarea>');
    expect(html).toContain('data-potentia-control="description" id="example-description" name="description" type="text" required value="long long');
    expect(html).not.toContain('<script>safe text</script>');
    expect(html).not.toContain('<b>default</b>');
  });

  test('renders hidden inputs only from explicit metadata and omits inline field chrome', () => {
    const form = formWithFields([
      field({ name: 'token', label: 'Token', input: 'hidden', help: 'Hidden help', defaultValue: '<token>' }),
      field({ name: 'nonce', label: 'Nonce', input: { type: 'hidden' }, defaultValue: 'abc' }),
      field({ name: 'passwordToken', label: 'Password Token', input: 'hidden', sensitive: true, defaultValue: 'secret-hidden' })
    ]);
    const state = createFormState({ ok: false, values: { token: '<state-token>', nonce: 'state-nonce', passwordToken: 'secret-hidden' }, issues: [issue('token', 'Token invalid')] });
    const html = renderForm(form, { action: '/secure', state: state });

    expect(html).toContain('<input data-potentia-control="token" id="example-token" name="token" type="hidden" value="&lt;token&gt;">');
    expect(html).toContain('<input data-potentia-control="nonce" id="example-nonce" name="nonce" type="hidden" value="state-nonce">');
    expect(html).toContain('<input data-potentia-control="passwordToken" id="example-passwordtoken" name="passwordToken" type="hidden">');
    expect(html).not.toContain('data-potentia-label="token"');
    expect(html).not.toContain('data-potentia-help="token"');
    expect(html).not.toContain('data-potentia-errors-for="token"');
    expect(html).not.toContain('secret-hidden');
  });

  test('select options support strings objects defaults escaping and malformed option filtering', () => {
    const form = formWithFields([
      field({ name: 'role', label: 'Role', options: ['user', 'admin'] }),
      field({ name: 'team', label: 'Team', options: [{ value: 'a&b', label: 'A <B>' }, { label: 'missing value' }, null], defaultValue: 'a&b' })
    ]);
    const state = createFormState({ ok: true, values: { role: 'admin' }, issues: [] });
    const html = renderForm(form, { action: '/settings', state: state });

    expect(html).toContain('<option value="user">user</option>');
    expect(html).toContain('<option value="admin" selected>admin</option>');
    expect(html).toContain('<option value="a&amp;b" selected>A &lt;B&gt;</option>');
    expect(html).not.toContain('missing value');
    expect(html).not.toContain('Select...');
  });

  test('stable data attributes and accessibility attributes render for fields', () => {
    const form = formWithFields([
      field({ name: 'email', label: 'Email', input: { type: 'email' }, help: 'Use your work email.' }),
      field({ name: 'name', label: 'Name' })
    ]);
    const state = createFormState({ ok: false, values: { email: 'bad' }, issues: [issue('email', 'Email is required.')] });
    const html = renderForm(form, { action: '/users', state: state });

    expect(html).toContain('data-potentia-form="example"');
    expect(html).toContain('data-potentia-field="email"');
    expect(html).toContain('data-potentia-label="email" for="example-email"');
    expect(html).toContain('data-potentia-control="email" id="example-email" name="email" type="email" required aria-describedby="example-email-help example-email-errors" aria-invalid="true" value="bad"');
    expect(html).toContain('data-potentia-help="email" id="example-email-help"');
    expect(html).toContain('data-potentia-errors-for="email" id="example-email-errors"');
    expect(html).toContain('<button type="submit" data-potentia-submit>Submit</button>');
    expect(html).toContain('data-potentia-control="name" id="example-name" name="name" type="text" required>');
    expect(html).not.toContain('id="example-name" name="name" type="text" required aria-invalid');
  });

  test('unknown input types fall back safely to text', () => {
    const form = formWithFields([
      field({ name: 'mystery', label: 'Mystery', input: { type: 'totally-new' }, defaultValue: 'value' })
    ]);
    const html = renderForm(form, { action: '/unknown' });

    expect(html).toContain('data-potentia-control="mystery" id="example-mystery" name="mystery" type="text" required value="value"');
  });
});

function issue(field, message) {
  return {
    code: 'invalid_value',
    message: message,
    path: field ? [field] : [],
    field: field,
    boundary: 'input',
    source: 'framework',
    expected: 'string',
    received: 'string',
    meta: null
  };
}

function formWithFields(fields) {
  return {
    kind: 'form',
    id: 'example',
    method: 'POST',
    encType: 'application/x-www-form-urlencoded',
    opaque: false,
    fields: fields,
    errors: { rootKey: '_form' }
  };
}

function field(options) {
  return {
    kind: 'field',
    name: options.name,
    path: [options.name],
    field: options.name,
    label: options.label,
    help: options.help || null,
    placeholder: options.placeholder || null,
    input: options.input || { type: 'text' },
    required: Object.prototype.hasOwnProperty.call(options, 'required') ? options.required : true,
    multiple: Boolean(options.multiple),
    sensitive: Boolean(options.sensitive),
    options: options.options || null,
    defaultValue: Object.prototype.hasOwnProperty.call(options, 'defaultValue') ? options.defaultValue : null,
    contract: { kind: 'sigil', expected: 'string' },
    meta: null
  };
}
