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
  document.body
);
