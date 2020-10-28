import StoriesData from "../pages/stories.data.js";
import StoryData from "../pages/stories/[id].data.js";
import UserData from "../pages/users/[id].data.js";

export default [
  {
    path: "/",
    component: "/pages/stories.js",
    data: StoriesData
  },
  {
    path: "/new",
    component: "/pages/stories.js",
    data: StoriesData
  },
  {
    path: "/show",
    component: "/pages/stories.js",
    data: StoriesData
  },
  {
    path: "/ask",
    component: "/pages/stories.js",
    data: StoriesData
  },
  {
    path: "/job",
    component: "/pages/stories.js",
    data: StoriesData
  },
  {
    path: "/users/:id",
    component: "/pages/users/[id].js",
    data: UserData
  },
  {
    path: "/stories/:id",
    component: "/pages/stories/[id].js",
    data: StoryData
  },
  {
    path: "*",
    component: "/pages/stories.js",
    data: StoriesData
  }
];
