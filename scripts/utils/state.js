const state = {};
const listeners = {};

export function setState(key, value) {
  state[key] = value;
  (listeners[key] || []).forEach(fn => fn(value));
}

export function getState(key) {
  return state[key];
}

export function subscribe(key, fn) {
  if (!listeners[key]) listeners[key] = [];
  listeners[key].push(fn);
}
