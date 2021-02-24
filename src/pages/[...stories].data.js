import { useStories } from "../lib/api";

export default function StoriesData(props) {
  const page = () => +(props.query?.page || 1),
    type = () => props.params.stories || "top",
    stories = useStories(type, page);

  return {
    get type() {
      return type();
    },
    get stories() {
      return stories();
    },
    get page() {
      return page();
    }
  };
}
