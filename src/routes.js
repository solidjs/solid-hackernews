import { lazy } from "solid-js";
import Nav from "./components/nav";
import StoriesData from "./pages/[...stories].data";
import StoryData from "./pages/stories/[id].data";
import UserData from "./pages/users/[id].data";

export default {
  path: "",
  component: (props) => (
    <>
      <Nav />
      {props.children}
    </>
  ),
  children: [
    {
      path: "/users/:id",
      component: lazy(() => import("./pages/users/[id]")),
      load: UserData
    },
    {
      path: "/stories/:id",
      component: lazy(() => import("./pages/stories/[id]")),
      load: StoryData
    },
    {
      path: "/*stories",
      component: lazy(() => import("./pages/[...stories]")),
      load: StoriesData
    }
  ]
};
