import { DataFn } from "solid-app-router";

import { useStories } from "../lib/api";
import { toGetters } from "../utils/toGetters";

const StoriesData: DataFn<{ stories?: string }> = (props) => {
  const page = () => ("page" in props.query ? parseInt(props.query.page as string, 10) : 1);
  const type = () => props.params.stories || "top";

  const [stories] = useStories(type, page);

  return toGetters({ type, stories, page });
};

export default StoriesData;
