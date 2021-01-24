import { lazy } from "solid-js";
import StoriesData from "./pages/stories.data.js";
import StoryData from "./pages/stories/[id].data.js";
import UserData from "./pages/users/[id].data.js";
const Stories = lazy(() => import("./pages/stories.jsx"));

export default [
  {
    path: "",
    component: Stories,
    data: StoriesData
  },
  {
    path: "new",
    component: Stories,
    data: StoriesData
  },
  {
    path: "show",
    component: Stories,
    data: StoriesData
  },
  {
    path: "ask",
    component: Stories,
    data: StoriesData
  },
  {
    path: "job",
    component: Stories,
    data: StoriesData
  },
  {
    path: "users/:id",
    component: lazy(() => import("./pages/users/[id].jsx")),
    data: UserData
  },
  {
    path: "stories/:id",
    component: lazy(() => import("./pages/stories/[id].jsx")),
    data: StoryData
  },
  {
    path: "*",
    component: Stories,
    data: StoriesData
  }
];
