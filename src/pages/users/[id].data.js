import { cache } from "@solidjs/router";
import fetchAPI from "../../lib/api";

export const getUser = cache((id) => fetchAPI(`user/${id}`), "user");

export default ({ params }) => getUser(params.id);
