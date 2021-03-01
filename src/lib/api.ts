import { createResource } from "solid-js";
import { isServer } from "solid-js/web";

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs"
} as const;

const cache = new Map<string, Promise<any[]>>();

const story = (path: string) => `https://node-hnapi.herokuapp.com/${path}`;
const user = (path: string) => `https://hacker-news.firebaseio.com/v0/${path}.json`;

async function get(path: string) {
  const isUser = path.startsWith("user");

  if (!cache.has(path)) {
    const url = isUser ? user(path) : story(path);
    const headers = isServer ? { "User-Agent": "chrome" } : {};

    const content = fetch(url, { headers }).then((r) => r.json());
    cache.set(path, content);
  }

  return cache.get(path);
}

export function useStory(id: () => string) {
  return createResource(() => `item/${id()}`, get);
}
export function useUser(id: () => string) {
  return createResource(() => `user/${id()}`, get);
}
export function useStories(type: () => string, page: () => number) {
  return createResource(() => `${mapStories[type()]}?page=${page()}`, get);
}
