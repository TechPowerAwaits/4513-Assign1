/*
 * Purpose: To form routes for Eras data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";
import { DataGetter } from "./dataRetrieval.mjs";
import { setParamInt } from "./routeParse.mjs";

/*
 * Purpose: Provides the names of all the fields in the Eras table.
 */
const fields = `
  eraId,
  eraName,
  eraYears
`;

/*
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Eras";

/*
 * Purpose: Sets up all the Eras-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Eras table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");

  router.get("/", async (req, resp) => {
    const { data, error } = await dataGetter.get();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("eraId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
