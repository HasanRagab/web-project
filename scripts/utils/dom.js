export const $ = (selector, scope = document) => scope.querySelector(selector);
export const $$ = (selector, scope = document) => [
  ...scope.querySelectorAll(selector),
];

export function createEl(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.class) el.className = options.class;
  if (options.text) el.textContent = options.text;

  if (options.attrs) {
    Object.entries(options.attrs).forEach(([k, v]) => {
      el.setAttribute(k, v);
    });
  }

  return el;
}

export async function loadComponent(selector, path) {
  const el = $(selector);
  if (!el) return;

  try {
    const res = await fetch(path);

    if (!res.ok) {
      const fallback = await fetch("/pages/404.html");
      el.innerHTML = await fallback.text();
      return;
    }

    el.innerHTML = await res.text();
  } catch (err) {
    console.error("Failed to load component:", path, err);
    const fallback = await fetch("/pages/404.html");
    el.innerHTML = await fallback.text();
  }
}
