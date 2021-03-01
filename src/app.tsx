import "./assets/index.css";

import { Router, Route } from "solid-app-router";

import Nav from "./components/nav";
import { routes } from "./routes";
import { Suspense } from "solid-js";

export default function App(props: { initialURL?: string }) {
  return (
    <Suspense fallback={<p>Loading data...</p>}>
      <Router routes={routes} initialURL={props.initialURL}>
        <Nav />
        <Route
          // @ts-ignore
          class="view"
        />
      </Router>
    </Suspense>
  );
}
