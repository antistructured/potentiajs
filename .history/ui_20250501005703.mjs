const mountHooks = new Set();
const destroyHooks = new Set();

export function onMount(fn) {
  mountHooks.add(fn);
}

export function onDestroy(fn) {
  destroyHooks.add(fn);
}

export function flushDestroyHooks() {
  destroyHooks.forEach((fn) => fn());
  destroyHooks.clear();
}

export function mount(html, handlers = {}) {
  flushDestroyHooks(); // cleanup old listeners
  document.body.innerHTML = html;

}
