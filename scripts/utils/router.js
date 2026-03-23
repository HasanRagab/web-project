import { loadComponent } from "./dom.js";

const routes = [
  { path: "/", page: "/pages/home.html" },
  { path: "/book", page: "/pages/book.html" },
  { path: "/cart", page: "/pages/cart.html" },
  { path: "/search", page: "/pages/search.html" },
];

const page404 = "/pages/404.html";

function matchRoute(path) {
  for (const route of routes) {
    const paramNames = [];

    const regexPath = route.path.replace(/:([^/]+)/g, (_, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });

    const regex = new RegExp(`^${regexPath}$`);
    const match = path.match(regex);

    if (match) {
      const params = {};
      paramNames.forEach((name, i) => {
        params[name] = match[i + 1];
      });

      return {
        page: route.page,
        params,
        route: route.path,
      };
    }
  }

  const baseMatch = routes
    .map(r => r.path)
    .sort((a, b) => b.length - a.length)
    .find(r => path === r || path.startsWith(r + "/"));

  if (baseMatch) {
    const route = routes.find(r => r.path === baseMatch);
    return {
      page: route.page,
      params: {},
      route: route.path,
    };
  }

  return null;
}

function updateActiveLink(path) {
  const links = document.querySelectorAll(".nav-link");

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (path === href || path.startsWith(href + "/")) {
      link.classList.add("text-primary");
    } else {
      link.classList.remove("text-primary");
    }
  });
}

async function loadPageScript(route, params) {
  try {
    const cleanRoute = route.replace(/:\w+/g, "");

    const module = await import(`/scripts/pages${cleanRoute}.js`);

    if (module.init) {
      module.init(params);
    }
  } catch (e) {
  }
}

export async function navigate(path, addToHistory = true) {
  const match = matchRoute(path);

  const page = match ? match.page : page404;

  await loadComponent("#app", page);

  if (addToHistory) {
    history.pushState({ path }, null, path);
  }

  updateActiveLink(path);

  window.__ROUTE_PARAMS__ = match?.params || {};

  if (match) {
    await loadPageScript(match.route, match.params);
  }
}

export function initRouter() {
  window.addEventListener("popstate", (e) => {
    const path = e.state?.path || location.pathname;
    navigate(path, false);
  });

  document.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-link]");
    if (!link) return;

    e.preventDefault();

    const path = link.getAttribute("href");
    navigate(path);
  });

  navigate(location.pathname, false);
}