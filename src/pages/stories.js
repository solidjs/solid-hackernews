import { Link } from "solid-app-router";
import Story from "../components/story";

export default function Stories(props) {
  return (
    <div class="news-view">
      <div class="news-list-nav">
        <Show when={props.page > 1} fallback={<a class="disabled">&lt; prev</a>}>
          <Link href={`${props.type}?page=${props.page - 1}`}>{"<"} prev</Link>
        </Show>
        <span>page {props.page}</span>
        <Show when={props.stories?.length === 30} fallback={<a class="disabled">more &gt;</a>}>
          <Link href={`${props.type}?page=${props.page + 1}`}>more {">"}</Link>
        </Show>
      </div>
      <div class="news-list">
        <Show when={props.stories}>
          <ul>
            <For each={props.stories}>{(story) => <Story story={story} />}</For>
          </ul>
        </Show>
      </div>
    </div>
  );
}
