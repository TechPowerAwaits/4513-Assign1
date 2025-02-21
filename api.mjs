/*
 * Purpose: To handle all API routes.
 */

import { createClient } from "@supabase/supabase-js";
import { Router } from "express";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/*
 * Purpose: To set up routes using the functionality of modules located in a
 * certain path.
 */
class APIRouteSetter {
  constructor(moduleName, routePath) {
    this.moduleName = moduleName;
    this.path = routePath;
    this.router = Router();
  }

  /*
   * Purpose: To set up routes based on given information.
   *
   * Details: If the module does not exist or if the setRoutes() method is not
   * exported by the module, an Error will occur.
   */
  async set() {
    const apiModule = await import(`./routes/${this.moduleName}.mjs`);
    apiModule.setRoutes(supabase, this.router);
  }
}

const routes = [
  new APIRouteSetter("Artists", "/artists"),
  new APIRouteSetter("Counts", "/counts"),
  new APIRouteSetter("Eras", "/eras"),
  new APIRouteSetter("Galleries", "/galleries"),
  new APIRouteSetter("Genres", "/genres"),
  new APIRouteSetter("Paintings", "/paintings"),
  new APIRouteSetter("AssociatedPaintings", "/paintings"),
  new APIRouteSetter("Shapes", "/shapes"),
];

/*
 * Purpose: Sets up all the API routes.
 *
 * Details: If a route fails to set, an error will be printed to the console.
 */
async function setRoutes(router) {
  await Promise.all(
    routes.map(async (routeSetter) => {
      try {
        await routeSetter.set();
        router.use(routeSetter.path, routeSetter.router);
      } catch (e) {
        console.error(`Failed to set API route '${routeSetter.path}'.`);
        console.error(e);
      }
    })
  );
}

export { setRoutes };
