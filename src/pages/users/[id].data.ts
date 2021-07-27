import { RouteDataFunc } from "solid-app-router";
import { useUser } from "../../lib/api";

const UserData: RouteDataFunc = (props) => {
  const [user] = useUser(() => props.params.id);

  return user;
};

export default UserData;
