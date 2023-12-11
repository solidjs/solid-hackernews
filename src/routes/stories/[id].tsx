import { A, useRouteData, RouteDefinition } from "@solidjs/router";
import { For, Show, createResource } from "solid-js";
import type { StoryDefinition } from "~/types";
import Comment from "~/components/comment";
import fetchAPI from "~/lib/api";

export const route = {
  data({ params }) {
    const [story] = createResource<StoryDefinition, string>(
      () => `item/${params.id}`,
      fetchAPI
    );
    return story;
  },
} satisfies Partial<RouteDefinition>;

export default function Story() {
  const story = useRouteData<typeof route.data>();
  return (
    <Show when={story()}>
      <div class="item-view">
        <div class="item-view-header">
          <a href={story().url} target="_blank">
            <h1>{story().title}</h1>
          </a>
          <Show when={story().domain}>
            <span class="host">({story().domain})</span>
          </Show>
          <p class="meta">
            {story().points} points | by{" "}
            <A href={`/users/${story().user}`}>{story().user}</A>{" "}
            {story().time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {story().comments_count
              ? story().comments_count + " comments"
              : "No comments yet."}
          </p>
          <ul class="comment-children">
            <For each={story().comments}>
              {(comment) => <Comment comment={comment} />}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
};
