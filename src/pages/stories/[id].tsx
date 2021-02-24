import { Link } from "solid-app-router";
import { Component, For, Show } from "solid-js";

import type { IStory } from "../../types";
import Comment from "../../components/comment";

const Story: Component<{ story: IStory }> = (props) => {
  return (
    <Show when={props.story}>
      <div class="item-view">
        <div class="item-view-header">
          <a href={props.story.url} target="_blank">
            <h1>{props.story.title}</h1>
          </a>
          <span v-if="item.url" class="host">
            ({props.story.domain})
          </span>
          <p class="meta">
            {props.story.points} points | by{" "}
            <Link href={`/users/${props.story.user}`}>{props.story.user}</Link>{" "}
            {props.story.time_ago} ago
          </p>
        </div>
        <div class="item-view-comments">
          <p class="item-view-comments-header">
            {props.story.comments_count
              ? props.story.comments_count + " comments"
              : "No comments yet."}
          </p>
          <ul class="comment-children">
            <For each={props.story.comments}>{(comment) => <Comment comment={comment} />}</For>
          </ul>
        </div>
      </div>
    </Show>
  );
};

export default Story;
