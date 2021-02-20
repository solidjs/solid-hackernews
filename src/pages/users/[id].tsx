import { Component, Show } from "solid-js";

export interface IUser {
  error: string;
  id: string;
  created: string;
  karma: number;
  about: string;
}

const User: Component<{ user: IUser }> = (props) => {
  return (
    <div class="user-view">
      <Show when={props.user}>
        <Show when={!props.user.error} fallback={<h1>User not found.</h1>}>
          <h1>User : {props.user.id}</h1>
          <ul class="meta">
            <li>
              <span class="label">Created:</span> {props.user.created}
            </li>
            <li>
              <span class="label">Karma:</span> {props.user.karma}
            </li>
            <Show when={props.user.about}>
              <li innerHTML={props.user.about} class="about" />{" "}
            </Show>
          </ul>
          <p class="links">
            <a href={`https://news.ycombinator.com/submitted?id=${props.user.id}`}>submissions</a> |{" "}
            <a href={`https://news.ycombinator.com/threads?id=${props.user.id}`}>comments</a>
          </p>
        </Show>
      </Show>
    </div>
  );
};

export default User;
