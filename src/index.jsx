import "./assets/index.css";
import { render } from "solid-js/web";
import { Router, Route } from "solid-app-router";

import { APIProvider } from "./lib/api";
import Nav from "./components/nav";

import routes from "./routes";

render(
  () => (
    <Router routes={routes} root={process.env.PUBLIC_URL}>
      <APIProvider>
        <Nav />
        <Route class="view" />
      </APIProvider>
    </Router>
  ),
  document.getElementById("app")
);

if (import.meta.env.PROD && "serviceWorker" in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`/sw.js`);
  });
}
