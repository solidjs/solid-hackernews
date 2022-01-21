import { createResource } from "solid-js";
import fetchAPI from "../../lib/api";


export default function UserData({ params }) {
  const [user] = createResource(() => `user/${params.id}`, fetchAPI);
  return user;
}
