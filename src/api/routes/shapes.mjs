/*
 * Purpose: To form routes for Shapes data.
 */

import { generateDefaultRoute, handleQueryResults } from "../dataHandling.mjs";
import { DataGetter } from "../dataRetrieval.mjs";
import { setParamInt } from "../routeParse.mjs";

/*
 * Purpose: Provides the names of all the fields in the Shapes table.
 */
const fields = `
  shapeId,
  shapeName
`;

/*
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Shapes";

/*
 * Purpose: Sets up all the Shapes-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Shapes table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");
  generateDefaultRoute(router, dataGetter);

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("shapeId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
