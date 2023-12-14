import { type RouteDefinition, type RouteSectionProps } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { Show } from "solid-js";
import fetchAPI from "~/lib/api";
import queryClient from "~/lib/queryClient";
import { UserDefinition } from "~/types";

const getUser = async (id: string): Promise<UserDefinition> => {
  return fetchAPI(`user/${id}`);
};

export const route = {
  load({ params }) {
    queryClient.prefetchQuery({
      queryKey: ["user", params.id],
      queryFn: () => getUser(params.id),
    })
  }
} satisfies RouteDefinition;

export default function User(props: RouteSectionProps) {
  const query = createQuery(() => ({
    queryKey: ["user", props.params.id],
    queryFn: () => getUser(props.params.id),
  }));
  return (
    <div class="user-view">
      <Show when={query.data}>
        <Show when={!query.error} fallback={<h1>User not found.</h1>}>
          <h1>User : {query.data!.id}</h1>
          <ul class="meta">
            <li>
              <span class="label">Created:</span> {query.data!.created}
            </li>
            <li>
              <span class="label">Karma:</span> {query.data!.karma}
            </li>
            <Show when={query.data!.about}>
              <li innerHTML={query.data!.about} class="about" />{" "}
            </Show>
          </ul>
          <p class="links">
            <a href={`https://news.ycombinator.com/submitted?id=${query.data!.id}`}>submissions</a> |{" "}
            <a href={`https://news.ycombinator.com/threads?id=${query.data!.id}`}>comments</a>
          </p>
        </Show>
      </Show>
    </div>
  );
};
