import { describe, expect, test } from 'bun:test';

import { groupIssuesByField } from '../src/kernel/form-state.js';

describe('kernel form state issue grouping', () => {
  test('groups single field issue', () => {
    const issue = formIssue('email');

    expect(groupIssuesByField([issue])).toEqual({ email: [issue] });
  });

  test('groups multiple issues per field', () => {
    const first = formIssue('email', 'invalid_type');
    const second = formIssue('email', 'invalid_format');

    expect(groupIssuesByField([first, second])).toEqual({ email: [first, second] });
  });

  test('groups root issue under _form', () => {
    const issue = formIssue(null);

    expect(groupIssuesByField([issue])).toEqual({ _form: [issue] });
  });

  test('groups invalid issue under _form', () => {
    expect(groupIssuesByField([null])).toEqual({ _form: [null] });
  });

  test('preserves issue order', () => {
    const first = formIssue('email', 'a');
    const second = formIssue('_form', 'b');
    const third = formIssue('email', 'c');

    const grouped = groupIssuesByField([first, second, third]);

    expect(grouped.email).toEqual([first, third]);
    expect(grouped._form).toEqual([second]);
  });

  test('does not mutate issue array', () => {
    const issue = formIssue('email');
    const issues = [issue];

    groupIssuesByField(issues);

    expect(issues).toEqual([issue]);
  });

  test('empty and missing issues return empty object', () => {
    expect(groupIssuesByField([])).toEqual({});
    expect(groupIssuesByField()).toEqual({});
  });
});

function formIssue(field, code = 'invalid_type') {
  return {
    code: code,
    message: 'Invalid value',
    path: field ? [field] : [],
    field: field,
    boundary: 'input',
    source: 'sigil',
    expected: 'string',
    received: 'number',
    meta: null
  };
}
