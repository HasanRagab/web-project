export function on(event, selector, handler) {
  document.addEventListener(event, (e) => {
    const target = e.target.closest(selector);
    if (target) handler(e, target);
  });
}