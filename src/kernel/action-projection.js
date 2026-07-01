import { projectContract } from './contract-projection.js';
import { isAction } from './action.js';

export function projectAction(value) {
  if (!isAction(value)) {
    return {
      kind: 'unknown-action',
      id: null,
      input: null,
      output: null,
      result: null,
      source: null,
      meta: null
    };
  }

  return {
    kind: 'action',
    id: value.id,
    input: value.input ? projectContract(value.input) : null,
    output: value.output ? projectContract(value.output) : null,
    result: projectActionResultSemantics(),
    source: value.source || null,
    meta: value.meta || null
  };
}

export function projectActionResultSemantics() {
  return {
    success: 'response-projection',
    validationFailure: 'action-input-failed',
    redirect: 'explicit',
    domainFailure: 'fail-result'
  };
}
