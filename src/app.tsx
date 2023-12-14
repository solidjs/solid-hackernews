// @refresh reload
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { QueryClientProvider } from "@tanstack/solid-query";
import { Suspense } from "solid-js";
import "./app.css";
import queryClient from "~/lib/queryClient";
import Nav from "~/components/nav";

export default function App() {
  return (
    <Router
      root={(props) => (
        <QueryClientProvider client={queryClient}>
          <Nav />
          <Suspense fallback={<div class="news-list-nav">Loading...</div>}>
            {props.children}
          </Suspense>
        </QueryClientProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
