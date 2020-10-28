import { createSignal, createComputed } from "solid-js";
import { useAPI } from "../../lib/api";

export default function StoryData(props) {
  const [story, setStory] = createSignal(),
    { getItem } = useAPI();

  createComputed(() => getItem(props.params.id).then(setStory));

  return {
    get story() {
      return story();
    }
  };
}
