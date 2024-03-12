import {
  createAsync,
  A,
  type RouteDefinition,
  cache,
  type RouteSectionProps,
} from "@solidjs/router";
import { For, Show } from "solid-js";
import fetchAPI from "~/lib/api";
import Story from "~/components/story";
import type { StoryDefinition, StoryTypes } from "~/types";

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
} as const;

const getStories = cache(
  async (type: StoryTypes, page: number): Promise<StoryDefinition[]> => {
    return fetchAPI(`${mapStories[type]}?page=${page}`);
  },
  "stories"
);

export const route = {
  load({ location, params }) {
    void getStories(
      (params.stories as StoryTypes) || "top",
      +location.query.page || 1
    );
  },
} satisfies RouteDefinition;

export default function Stories(props: RouteSectionProps) {
  const page = () => +props.location.query.page || 1;
  const type = () => (props.params.stories || "top") as StoryTypes;
  const stories = createAsync(() => getStories(type(), page()));
  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show
          when={page() > 1}
          fallback={
            <span class="page-link disabled" aria-disabled="true">
              {"<"} prev
            </span>
          }
        >
          <A
            class="page-link"
            href={`/${type()}?page=${page() - 1}`}
            aria-label="Previous Page"
          >
            {"<"} prev
          </A>
        </Show>
        <span>page {page()}</span>
        <Show
          when={stories() && stories().length >= 29}
          fallback={
            <span class="page-link disabled" aria-disabled="true">
              more {">"}
            </span>
          }
        >
          <A
            class="page-link"
            href={`/${type()}?page=${page() + 1}`}
            aria-label="Next Page"
          >
            more {">"}
          </A>
        </Show>
      </div>
      <main class="news-list">
        <Show when={stories()}>
          <ul>
            <For each={stories()}>{(story) => <Story story={story} />}</For>
          </ul>
        </Show>
      </main>
    </div>
  );
}
