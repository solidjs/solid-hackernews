import {
  cache,
  createAsync,
  A,
  type RouteDefinition,
  type RouteSectionProps,
} from "@solidjs/router";
import { For, Show } from "solid-js";
import Comment from "~/components/comment";
import fetchAPI from "~/lib/api";
import { StoryDefinition } from "~/types";

const getStory = cache(async (id: string): Promise<StoryDefinition> => {
  return fetchAPI(`item/${id}`);
}, "story");

export const route = {
  load({ params }) {
    void getStory(params.id);
  },
} satisfies RouteDefinition;

export default function Story(props: RouteSectionProps) {
  const story = createAsync(() => getStory(props.params.id));
  return (
    <Show when={story()}>
      <div class="item-view">
        <div class="item-view-header">
          <A href={story()!.url} target="_blank">
            <h1>{story()!.title}</h1>
          </A>
          <Show when={story()!.domain}>
            <span class="host">({story()!.domain})</span>
          </Show>
          <p class="meta">
            {story()!.points} points | by{" "}
            <A href={`/users/${story()!.user}`}>{story()!.user}</A>{" "}
            {story()!.time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {story()!.comments_count
              ? story()!.comments_count + " comments"
              : "No comments yet."}
          </p>
          <ul class="comment-children">
            <For each={story()!.comments}>
              {(comment) => <Comment comment={comment} />}
            </For>
          </ul>
        </div>
      </div>
    </Show>
  );
}
