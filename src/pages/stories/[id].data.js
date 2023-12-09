import { cache } from "@solidjs/router";
import fetchAPI from "../../lib/api";

export const getStory = cache((id) => fetchAPI(`item/${id}`), "story");

export default ({ params }) => getStory(params.id);
