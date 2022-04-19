import { StartServer, renderStream } from "solid-start/entry-server";

export default renderStream((context) => <StartServer context={context} />)();
