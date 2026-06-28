import { handle } from "hono/netlify";
import { app } from "../../apps/api/src/app";

export default handle(app);
