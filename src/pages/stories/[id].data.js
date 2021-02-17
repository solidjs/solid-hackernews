import { useStory } from "../../lib/api";

export default function StoryData(props) {
  const story = useStory(() => props.params.id);

  return {
    get story() {
      return story();
    }
  };
}
