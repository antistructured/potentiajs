const targetMap = new WeakMap();
let activeEffect = null;

export function reactive(target) {
  if (typeof target !== 'object' || target === null) {
    throw new Error('Reactive target must be an object.');
  }

  return new Proxy(target, {
    get (obj, prop) {
      return obj[prop];
    },
    set (obj, prop, value) {
      const oldValue = obj[prop];
      obj[prop] = value;
      if (oldValue !== value) trigger(obj, prop);
      return true;
    }
  });
}

function track(obj, prop) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(prop);
  if (!dep) {
    dep = new Set();
    depsMap.set(prop, dep);
  }
  dep.add(activeEffect);
}

let updateQueue = new Set();
let scheduled = false;

function queueUpdate(fn) {
  if (fn) updateQueue.add(fn);
  if (!scheduled) {
    scheduled = true;
    queueMicrotask(flushUpdates);
  }
}

function flushUpdates() {
  scheduled = false;
  updateQueue.forEach(fn => fn());
  updateQueue.clear();
}

export function watch(effect) {
  queueUpdate(effect);
}
