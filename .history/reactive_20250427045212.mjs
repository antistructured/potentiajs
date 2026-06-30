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
