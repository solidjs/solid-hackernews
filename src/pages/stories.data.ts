import { createMemo } from "solid-js";
import { useRouter, DataFn } from "solid-app-router";

import { useStories } from "../lib/api";
import { toGetters } from "../utils/toGetters";

const TYPES = ["new", "show", "ask", "job"] as const;

const StoriesData: DataFn = (props) => {
  const router = useRouter();
  const page = () => +(props.query?.page || 1);

  const type = createMemo(() => {
    const type = TYPES.find((type) => router.location.includes(type));
    return type || "top";
  });

  const [stories] = useStories(type, page);

  return toGetters({ type, stories, page });
};

export default StoriesData;
