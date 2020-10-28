import { render } from "solid-js/dom";
import { Router, Route } from "solid-app-router";

import { APIProvider } from "./lib/api";
import Nav from "./components/nav";

import routes from "./lib/routes";

render(
  () => (
    <Router routes={routes}>
      <APIProvider>
        <Nav />
        <Route class="view" />
      </APIProvider>
    </Router>
  ),
  document.body
);
