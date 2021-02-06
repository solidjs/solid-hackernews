import { createResource } from "solid-js";

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs"
};

const cache = {};

const get = (path) =>
  cache[path] ||
  (cache[path] = fetch(`https://node-hnapi.herokuapp.com/${path}`).then((r) => r.json()));

export function useStory(id) {
  return createResource(() => `item/${id()}`, get)[0];
}
export function useUser(id) {
  return createResource(() => `user/${id()}`, get)[0];
}
export function useStories(type, page) {
  return createResource(() => `${mapStories[type()]}?page=${page()}`, get)[0];
}
