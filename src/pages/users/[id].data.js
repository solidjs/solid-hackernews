import { createSignal, createComputed } from "solid-js";
import { useAPI } from "../../lib/api";

export default function UserData(props) {
  const [user, setUser] = createSignal(),
    { getUser } = useAPI();

  createComputed(() => getUser(props.params.id).then(setUser));

  return {
    get user() {
      return user();
    }
  };
}
