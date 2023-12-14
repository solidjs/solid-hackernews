import { type RouteDefinition, type RouteSectionProps } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import fetchAPI from "~/lib/api";
import queryClient from "~/lib/queryClient";
import Story from "~/components/story";
import type { StoryDefinition, StoryTypes } from "~/types";

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
} as const;

const getStories = async (type: StoryTypes, page: number): Promise<StoryDefinition[]> => {
  return fetchAPI(`${mapStories[type]}?page=${page}`);
};

export const route = {
  load({ location, params }) {
    const type = (params.stories || "top") as StoryTypes;
    const page = +location.query.page || 1;
    queryClient.prefetchQuery({
      queryKey: ["stories", type, page],
      queryFn: () => getStories(type, page),
    });
  },
} satisfies RouteDefinition;

export default function Stories(props: RouteSectionProps) {
  const page = () => +props.location.query.page || 1;
  const type = () => (props.params.stories || "top") as StoryTypes;
  const query = createQuery(() => ({
    queryKey: ["stories", type(), page()],
    queryFn: () => getStories(type(), page()),
  }));
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
          <a
            class="page-link"
            href={`/${type()}?page=${page() - 1}`}
            aria-label="Previous Page"
          >
            {"<"} prev
          </a>
        </Show>
        <span>page {page()}</span>
        <Show
          when={query.data && query.data.length >= 29}
          fallback={
            <span class="page-link disabled" aria-disabled="true">
              more {">"}
            </span>
          }
        >
          <a
            class="page-link"
            href={`/${type()}?page=${page() + 1}`}
            aria-label="Next Page"
          >
            more {">"}
          </a>
        </Show>
      </div>
      <main class="news-list">
        <Show when={query.data}>
          <ul>
            <For each={query.data}>{(story) => <Story story={story} />}</For>
          </ul>
        </Show>
      </main>
    </div>
  );
}
