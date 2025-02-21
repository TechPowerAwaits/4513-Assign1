/*
 * Purpose: To form routes for Eras data.
 */

import { appendTableRefs, handleQueryResults } from "./RouteCommon.mjs";

/*
 * Purpose: Provides the names of all the fields in the Eras table.
 */
const fields = `
  eraId,
  eraName,
  eraYears
`;

/*
 * Purpose: Sets up all the Eras-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Eras table.
 */
async function setRoutes(supabase, router) {
  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await getData().eq("eraId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Eras data.
   */
  function getData(...tableRefs) {
    return supabase.from("Eras").select(appendTableRefs(fields, tableRefs));
  }
}

export { fields, setRoutes };
