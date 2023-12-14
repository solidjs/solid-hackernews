import {
  type RouteDefinition,
  type RouteSectionProps,
} from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import Comment from "~/components/comment";
import fetchAPI from "~/lib/api";
import queryClient from "~/lib/queryClient";
import { StoryDefinition } from "~/types";

const getStory = async (id: string): Promise<StoryDefinition> => {
  return fetchAPI(`item/${id}`);
};

export const route = {
  load({ params }) {
    queryClient.prefetchQuery({
      queryKey: ["story", params.id],
      queryFn: () => getStory(params.id),
    });
  },
} satisfies RouteDefinition;

export default function Story(props: RouteSectionProps) {
  const query = createQuery(() => ({
    queryKey: ["story", props.params.id],
    queryFn: () => getStory(props.params.id),
  }));
  return (
    <Show when={query.data}>
      <div class="item-view">
        <div class="item-view-header">
          <a href={query.data!.url} target="_blank">
            <h1>{query.data!.title}</h1>
          </a>
          <Show when={query.data!.domain}>
            <span class="host">({query.data!.domain})</span>
          </Show>
          <p class="meta">
            {query.data!.points} points | by{" "}
            <a href={`/users/${query.data!.user}`}>{query.data!.user}</a>{" "}
            {query.data!.time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {query.data!.comments_count
              ? query.data!.comments_count + " comments"
              : "No comments yet."}
          </p>
          <ul class="comment-children">
            <For each={query.data!.comments}>
              {(comment) => <Comment comment={comment} />}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
}
