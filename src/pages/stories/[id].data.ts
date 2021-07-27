import { RouteDataFunc } from "solid-app-router";
import { useStory } from "../../lib/api";

const StoryData: RouteDataFunc = (props) => {
  const [story] = useStory(() => props.params.id);
  return story;
};

export default StoryData;
