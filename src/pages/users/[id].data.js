import { useUser } from "../../lib/api";

export default function UserData(props) {
  const user = useUser(() => props.params.id);

  return {
    get user() {
      return user();
    }
  };
}
