import { RouteDataFunc } from "solid-app-router";

import { useStories } from "../lib/api";

const StoriesData: RouteDataFunc = ({ location, params }) => {
  const page = () => +location.query.page || 1;
  const type = () => params.stories || "top";

  const [stories] = useStories(type, page);

  return { type, stories, page };
};

export default StoriesData;
