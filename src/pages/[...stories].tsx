import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";

import type { IStory } from "../types";
import Story from "../components/story";

interface Props {
  page: number;
  type: string;
  stories: IStory[];
}

const Stories: Component<Props> = (props) => {
  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show
          when={props.page > 1}
          fallback={
            <span class="page-link disabled" aria-hidden="true">
              &lt; prev
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${props.type}?page=${props.page - 1}`}
            aria-label="Previous Page"
          >
            {"<"} prev
          </Link>
        </Show>
        <span>page {props.page}</span>
        <Show
          when={props.stories?.length === 30}
          fallback={
            <span class="page-link" aria-hidden="true">
              more &gt;
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${props.type}?page=${props.page + 1}`}
            aria-label="Next Page"
          >
            more {">"}
          </Link>
        </Show>
      </div>
      <main class="news-list">
        <Show when={props.stories}>
          <ul>
            <For each={props.stories}>{(story) => <Story story={story} />}</For>
          </ul>
        </Show>
      </main>
    </div>
  );
};

export default Stories;
