import { createResource } from "solid-js";
import fetchAPI from "../../lib/api";

export default function StoryData({ params }) {
  const [story] = createResource(() => `item/${params.id}`, fetchAPI);
  return story;
}
