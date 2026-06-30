export function effect(generatorOrFunction) {
  return {
    type: 'effect',
    run: generatorOrFunction
  };
}

export function call(fn, ...args) {
  return {
    type: 'call',
    fn: fn,
    args: args,
    meta: null
  };
}

export function value(value) {
  return {
    type: 'value',
    value: value,
    meta: null
  };
}

export function context(key) {
  return {
    type: 'context',
    key: key,
    meta: null
  };
}

export async function runEffect(effectValue, context = null, ...args) {
  if (isEffectDescriptor(effectValue)) {
    return runEffectFunction(effectValue.run, context, args);
  }

  if (typeof effectValue === 'function') {
    return runEffectFunction(effectValue, context, args);
  }

  return effectValue;
}

async function runEffectFunction(fn, context, args) {
  const value = fn(context, ...args);

  if (isIterator(value)) {
    return runIterator(value, context);
  }

  return await value;
}

async function runIterator(iterator, context) {
  let input = undefined;

  while (true) {
    const next = iterator.next(input);
    if (next.done) return await next.value;
    input = await runCommand(next.value, context);
  }
}

async function runCommand(command, context) {
  if (!command || typeof command !== 'object') return command;

  validateCommand(command);

  if (command.type === 'value') return command.value;

  if (command.type === 'call') {
    const args = Object.prototype.hasOwnProperty.call(command, 'args') ? command.args : [];
    return await command.fn(...args);
  }

  if (command.type === 'context') {
    return context ? context[command.key] : undefined;
  }

  throw new Error(`Unsupported effect command type: ${command.type}`);
}

function validateCommand(command) {
  if (!Object.prototype.hasOwnProperty.call(command, 'type')) {
    throw new Error('Invalid effect command: type must be a string');
  }

  if (typeof command.type !== 'string' || command.type.length === 0) {
    throw new Error('Invalid effect command: type must be a string');
  }

  if (command.type === 'value') return;

  if (command.type === 'call') {
    if (typeof command.fn !== 'function') {
      throw new Error('Invalid effect call command: fn must be a function');
    }
    if (Object.prototype.hasOwnProperty.call(command, 'args') && !Array.isArray(command.args)) {
      throw new Error('Invalid effect call command: args must be an array when provided');
    }
    return;
  }

  if (command.type === 'context') {
    if (typeof command.key !== 'string' || command.key.length === 0) {
      throw new Error('Invalid effect context command: key must be a non-empty string');
    }
    return;
  }
}

function isEffectDescriptor(value) {
  return Boolean(value && typeof value === 'object' && value.type === 'effect' && typeof value.run === 'function');
}

function isIterator(value) {
  return Boolean(value && typeof value === 'object' && typeof value.next === 'function');
}
