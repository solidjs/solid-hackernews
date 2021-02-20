import { DataFn } from "solid-app-router";
import { useStory } from "../../lib/api";
import { toGetters } from "../../utils/toGetters";

const StoryData: DataFn<{ id: string }> = (props) => {
  const [story] = useStory(() => props.params.id);
  return toGetters({ story });
};

export default StoryData;
