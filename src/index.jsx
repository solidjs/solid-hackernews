import { render } from "solid-js/web";
import { Router, useRoutes } from "solid-app-router";

import Nav from "./components/nav";

import routes from "./routes";

const Outlet = useRoutes(routes);

render(
  () => (
    <Router routes={routes} root={process.env.PUBLIC_URL}>
      <Nav />
      <Outlet />
    </Router>
  ),
  document.body
);

if ("serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}sw.js`);
  });
}
