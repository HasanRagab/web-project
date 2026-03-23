import { loadComponent } from "./utils/dom.js";
import { initRouter } from "./utils/router.js";

async function init() {
  await loadComponent("#navbar", "/components/navbar.html");
  await loadComponent("#footer", "/components/footer.html");

  initRouter();
}

init();