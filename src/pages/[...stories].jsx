import { createAsync } from "@solidjs/router";
import { getStories } from "./[...stories].data";
import Story from "../components/story";

export default function Stories(props) {
  const page = () => +(props.location.query.page || 1),
    type = () => props.params.stories || "top",
    stories = createAsync(() => getStories(type(), page()));
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
          <a class="page-link" href={`/${type()}?page=${page() - 1}`} aria-label="Previous Page">
            {"<"} prev
          </a>
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
          <a class="page-link" href={`/${type()}?page=${page() + 1}`} aria-label="Next Page">
            more {">"}
          </a>
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
