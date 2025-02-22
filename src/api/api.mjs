/*
 * Purpose: To handle all API routes.
 */

import { createClient } from "@supabase/supabase-js";
import { Router } from "express";
import { errorMessages } from "../errorMsg.mjs";

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
  new APIRouteSetter("artists", "/artists"),
  new APIRouteSetter("counts", "/counts"),
  new APIRouteSetter("eras", "/eras"),
  new APIRouteSetter("galleries", "/galleries"),
  new APIRouteSetter("genres", "/genres"),
  new APIRouteSetter("paintings", "/paintings"),
  new APIRouteSetter("associatedPaintings", "/paintings"),
  new APIRouteSetter("shapes", "/shapes"),
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

  // Thanks to Express's FAQ for mentioning how to handle 404 Errors.
  // https://expressjs.com/en/starter/faq.html
  router.use((req, resp, next) => {
    errorMessages["notFound"].sendJSON(resp);
  });
}

export { setRoutes };
