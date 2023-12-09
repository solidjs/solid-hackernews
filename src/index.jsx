import { render } from "solid-js/web";
import { Router } from "@solidjs/router";

import routes from "./routes";

render(
  () => (
    <Router routes={routes} base={process.env.PUBLIC_URL}>
      {routes}
    </Router>
  ),
  document.body
);

// if ("serviceWorker" in navigator) {
//   // Use the window load event to keep the page load performant
//   window.addEventListener("load", () => {
//     navigator.serviceWorker.register(`${process.env.PUBLIC_URL}sw.js`);
//   });
// }
