import { render } from "solid-js/web";
import { Router, Route } from "solid-app-router";

import Nav from "./components/nav";

import routes from "./routes";

render(
  () => (
    <Router routes={routes} root={process.env.PUBLIC_URL}>
      <Nav />
      <Route class="view" />
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
