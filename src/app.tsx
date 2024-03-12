// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import "./app.css";
import Nav from "./components/nav";

const base = import.meta.env.SERVER_BASE_URL;

export default function App() {
  return (
    <Router
      base={base}
      root={(props) => (
        <>
          <Nav />
          <Suspense fallback={<div class="news-list-nav">Loading...</div>}>
            {props.children}
          </Suspense>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
