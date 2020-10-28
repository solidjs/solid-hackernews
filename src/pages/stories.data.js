import { useRouter } from "solid-app-router";
import { useAPI } from "../lib/api";
import { createComputed, createMemo, createSignal } from "solid-js";

const TYPES = ["new", "show", "ask", "job"];
function getType() {
  const { router } = useRouter();
  return createMemo(() => {
    const loc = router.location;
    for (let i = 0; i < TYPES.length; i++) {
      if (loc.includes(TYPES[i])) return TYPES[i];
    }
    return "top";
  });
}

export default function StoriesData(props) {
  const [stories, setStories] = createSignal(),
    { getStories } = useAPI(),
    page = () => +(props.query?.page || 1),
    type = getType();

  createComputed(() => getStories(type(), page()).then(setStories));

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
