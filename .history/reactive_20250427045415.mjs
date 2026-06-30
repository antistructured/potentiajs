export function reactive(target) {
  if (typeof target !== 'object' || target === null) {
    throw new Error('Reactive target must be an object.');
  }

  return new Proxy(target, {
    get (obj, prop) {
      return obj[prop];
    },
    set (obj, prop, value) {
      obj[prop] = value;
      queueUpdate();
      return true;
    }
  });
}

let updateQueue = new Set();
let scheduled = false;

function queueUpdate(fn) {
  if (fn) updateQueue.add(fn);
  if (!scheduled) {
    scheduled = true;
    Promise.resolve().then(() => {
      updateQueue.forEach(fn => fn());
      updateQueue.clear();
      scheduled = false;
    });
  }
}
