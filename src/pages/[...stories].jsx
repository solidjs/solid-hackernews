import { Link, useData } from "solid-app-router";
import Story from "../components/story";

export default function Stories() {
  const { stories, type, page } = useData();
  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show
          when={page() > 1}
          fallback={
            <span class="page-link disabled" aria-hidden="true">
              &lt; prev
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${type()}?page=${page() - 1}`}
            aria-label="Previous Page"
          >
            {"<"} prev
          </Link>
        </Show>
        <span>page {page()}</span>
        <Show
          when={stories()?.length >= 28}
          fallback={
            <span class="page-link disabled" aria-hidden="true">
              more &gt;
            </span>
          }
        >
          <Link
            class="page-link"
            href={`/${type()}?page=${page() + 1}`}
            aria-label="Next Page"
          >
            more {">"}
          </Link>
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
