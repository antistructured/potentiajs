import { describe, expect, test } from 'bun:test';

import { action, createRouteManifest, projectAction, route } from '../src/index.js';

describe('kernel action result projection semantics', () => {
  test('action projection includes deterministic result semantics', () => {
    const projection = projectAction(action('users.create', () => 'ok'));

    expect(projection.result).toEqual(resultSemantics());
  });

  test('action projection remains deterministic', () => {
    const createUser = action('users.create', () => 'ok');

    expect(projectAction(createUser)).toEqual(projectAction(createUser));
  });

  test('manifest action metadata includes content types', () => {
    const manifest = createRouteManifest([route('POST', '/users', action('users.create', () => 'ok'))]);

    expect(manifest.actions[0].contentTypes).toEqual(['application/json', 'application/x-www-form-urlencoded']);
  });

  test('manifest action metadata includes plainForm enhancement', () => {
    const manifest = createRouteManifest([route('POST', '/users', action('users.create', () => 'ok'))]);

    expect(manifest.actions[0].enhancement).toEqual({
      plainForm: true,
      fetch: true,
      clientValidation: 'projection-only'
    });
  });

  test('manifest action metadata includes result semantics', () => {
    const manifest = createRouteManifest([route('POST', '/users', action('users.create', () => 'ok'))]);

    expect(manifest.actions[0].result).toEqual(resultSemantics());
  });

  test('projection does not execute handler', () => {
    let ran = false;
    const createUser = action('users.create', () => {
      ran = true;
      return 'ok';
    });

    projectAction(createUser);
    createRouteManifest([route('POST', '/users', createUser)]);

    expect(ran).toBe(false);
  });
});

function resultSemantics() {
  return {
    success: 'response-projection',
    validationFailure: 'action-input-failed',
    redirect: 'explicit',
    domainFailure: 'fail-result'
  };
}
