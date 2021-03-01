import "./assets/index.css";

import { Router, Route } from "solid-app-router";

import Nav from "./components/nav";
import { routes } from "./routes";
import { Suspense } from "solid-js";

export default function App(props: { initialURL?: string }) {
  return (
    <Router routes={routes} initialURL={props.initialURL}>
      <Nav />
      <Suspense fallback={<p>Loading data...</p>}>
        <Route
          // @ts-ignore
          class="view"
        />
      </Suspense>
    </Router>
  );
}
