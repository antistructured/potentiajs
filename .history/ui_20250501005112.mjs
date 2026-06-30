const mountHooks = new Set();
const destroyHooks = new Set();

export function onMount(fn) {
  mountHooks.add(fn);
}

export function onDestroy(fn) {
  destroyHooks.add(fn);
}

