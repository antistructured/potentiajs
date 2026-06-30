const mountHooks = new Set();
const destroyHooks = new Set();
const injectedStyles = new Set();

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
  Object.entries(handlers).forEach(([id, map]) => {
    const el = document.getElementById(id);

    if (!el) return;

    Object.entries(map).forEach(([event, fn]) => {
      el[`on${event.toLowerCase()}`] = fn;
    });
  });

  flushMountHooks();
}

export function injectStyle(id, css) {
  if (injectedStyles.has(id)) return;
  injectedStyles.add(id);

  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}
