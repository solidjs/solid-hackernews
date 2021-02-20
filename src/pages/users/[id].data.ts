import { DataFn } from "solid-app-router";
import { useUser } from "../../lib/api";
import { toGetters } from "../../utils/toGetters";

const UserData: DataFn<{ id: string }> = (props) => {
  const [user] = useUser(() => props.params.id);

  return toGetters({ user });
};

export default UserData;
