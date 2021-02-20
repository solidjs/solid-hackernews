import { lazy } from "solid-js";
import type { RouteDefinition } from "solid-app-router";
import StoriesData from "./pages/stories.data";
import StoryData from "./pages/stories/[id].data";
import UserData from "./pages/users/[id].data";
const Stories = lazy(() => import("./pages/stories"));

export const routes: RouteDefinition[] = [
  {
    path: "/",
    component: Stories,
    data: StoriesData
  },
  {
    path: "/new",
    component: Stories,
    data: StoriesData
  },
  {
    path: "/show",
    component: Stories,
    data: StoriesData
  },
  {
    path: "/ask",
    component: Stories,
    data: StoriesData
  },
  {
    path: "/job",
    component: Stories,
    data: StoriesData
  },
  {
    path: "/users/:id",
    component: lazy(() => import("./pages/users/[id]")),
    data: UserData
  },
  {
    path: "/stories/:id",
    component: lazy(() => import("./pages/stories/[id]")),
    data: StoryData
  },
  {
    path: "*",
    component: Stories,
    data: StoriesData
  }
];
