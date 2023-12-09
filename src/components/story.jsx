export default function Story(props) {
  return (
    <li class="news-item">
      <span class="score">{props.story.points}</span>
      <span class="title">
        <Show
          when={props.story.url && !props.story.url.startsWith('item?id=')}
          fallback={<a href={`/item/${props.story.id}`}>{props.story.title}</a>}
        >
          <a href={props.story.url} target="_blank" rel="noreferrer">
            {props.story.title}
          </a>
          <span class="host"> ({props.story.domain})</span>
        </Show>
      </span>
      <br />
      <span class="meta">
        <Show
          when={props.story.type !== "job"}
          fallback={<a href={`/stories/${props.story.id}`}>{props.story.time_ago}</a>}
        >
          by <a href={`/users/${props.story.user}`}>{props.story.user}</a>{" "}
          {props.story.time_ago} |{" "}
          <a href={`/stories/${props.story.id}`}>
            {props.story.comments_count ? `${props.story.comments_count} comments` : "discuss"}
          </a>
        </Show>
      </span>
      <Show when={props.story.type !== "link"}>
        {" "}
        <span class="label">{props.story.type}</span>
      </Show>
    </li>
  );
}
