import { createContext, useContext } from "solid-js";

const APIContext = createContext();
export function APIProvider(props) {
  return <APIContext.Provider value={createAPI()}>{props.children}</APIContext.Provider>;
}

export function useAPI() {
  return useContext(APIContext);
}

const mapStories = {
  top: "news",
  new: "newest",
  show: "show",
  ask: "ask",
  job: "jobs"
};
function createAPI() {
  const cache = {};

  const get = (path) =>
    cache[path] ||
    (cache[path] = fetch(`https://node-hnapi.herokuapp.com/${path}`).then((r) => r.json()));

  return {
    getItem: (id) => get(`item/${id}`),
    getUser: (id) => get(`user/${id}`),
    getStories: (type, page) => get(`${mapStories[type]}?page=${page}`)
  };
}
