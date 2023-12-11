import { A, useRouteData, RouteDefinition } from "@solidjs/router";
import { For, Show, createResource, Component } from "solid-js";
import fetchAPI from "~/lib/api";
import Story from "~/components/story";
import type { StoryDefinition } from "~/types";

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs",
} as const;

export const route = {
  data({ location, params }) {
    const page = () => +location.query.page || 1;
    const type = () => params.stories || "top";

    const [stories] = createResource<StoryDefinition[], string>(
      () => `${mapStories[type()]}?page=${page()}`,
      fetchAPI
    );

    return { type, stories, page };
  },
} satisfies Partial<RouteDefinition>;

const Stories: Component = () => {
  const { page, type, stories } = useRouteData<typeof route.data>();
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
            <For each={stories()}>
              {(story) => <Story story={story} />}
            </For>
          </ul>
        </Show>
      </main>
    </div>
  );
};

export default Stories;
