import { normalizeContract } from './contract.js';

export function projectContract(contract) {
  const adapter = normalizeContract(contract);
  const rawProjection = adapter.project();
  const kind = normalizeKind(rawProjection.kind);
  const capabilities = normalizeCapabilities(rawProjection.capabilities);
  const schema = projectSchema(adapter.source, kind);
  const fields = projectFields(adapter.source, kind, schema);
  const required = projectRequired(adapter.source, kind, schema, fields);
  const optional = fields && required ? fields.map((field) => field.name).filter((field) => !required.includes(field)) : null;

  return {
    kind: kind,
    capabilities: capabilities,
    capability: capabilityObject(capabilities),
    opaque: kind !== 'sigil',
    schema: schema,
    fields: fields,
    required: required,
    optional: optional,
    meta: null
  };
}

function normalizeKind(kind) {
  if (kind === 'generic-function') return 'function';
  if (kind === 'generic-parse') return 'parse';
  if (kind === 'generic-check') return 'check';
  if (kind === 'sigil') return 'sigil';
  if (kind === 'none') return 'none';
  return 'unknown';
}

function normalizeCapabilities(capabilities) {
  return Array.isArray(capabilities) ? capabilities.map(normalizeCapability).filter(Boolean) : [];
}

function normalizeCapability(capability) {
  if (capability === 'safeParse' || capability === 'describe') return null;
  if (capability === 'project') return 'project';
  if (capability === 'parse') return 'parse';
  if (capability === 'check') return 'check';
  return String(capability || '') || null;
}

function capabilityObject(capabilities) {
  return {
    parse: capabilities.includes('parse'),
    check: capabilities.includes('check'),
    project: capabilities.includes('project')
  };
}

function projectSchema(contract, kind) {
  if (kind !== 'sigil') return null;

  if (contract && typeof contract.toJSONSchema === 'function') {
    return contract.toJSONSchema();
  }

  return null;
}

function projectFields(contract, kind, schema) {
  if (kind !== 'sigil') return null;

  const described = describeContract(contract);
  if (described && Array.isArray(described.properties)) {
    return described.properties.map(projectDescribedProperty).filter(Boolean);
  }

  if (schema && schema.properties && typeof schema.properties === 'object') {
    const required = Array.isArray(schema.required) ? schema.required : [];
    return Object.keys(schema.properties).map((name) => ({
      name: name,
      required: required.includes(name),
      kind: typeof schema.properties[name]?.type === 'string' ? schema.properties[name].type : 'unknown',
      fields: null
    }));
  }

  return null;
}

function projectRequired(contract, kind, schema, fields) {
  if (kind !== 'sigil') return null;

  const described = describeContract(contract);
  if (described && Array.isArray(described.properties)) {
    return described.properties.filter((property) => property.required === true).map((property) => property.key).filter((key) => typeof key === 'string');
  }

  if (schema && Array.isArray(schema.required)) {
    return schema.required.slice();
  }

  return fields ? fields.filter((field) => field.required).map((field) => field.name) : null;
}

function projectDescribedProperty(property) {
  if (!property || typeof property.key !== 'string') return null;

  return {
    name: property.key,
    required: property.required === true,
    kind: describedKind(property.contract),
    fields: describedFields(property.contract)
  };
}

function describedFields(contract) {
  if (!contract || !Array.isArray(contract.properties)) return null;
  return contract.properties.map(projectDescribedProperty).filter(Boolean);
}

function describedKind(contract) {
  if (!contract || typeof contract.kind !== 'string') return 'unknown';
  return contract.kind;
}

function describeContract(contract) {
  if (!contract || typeof contract.describe !== 'function') return null;
  try {
    return contract.describe();
  } catch {
    return null;
  }
}
