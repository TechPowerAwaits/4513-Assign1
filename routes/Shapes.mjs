/*
 * Purpose: To form routes for Shapes data.
 */

import { appendTableRefs, handleQueryResults } from "./RouteCommon.mjs";

/*
 * Purpose: Provides the names of all the fields in the Shapes table.
 */
const fields = `
  shapeId,
  shapeName
`;

/*
 * Purpose: Sets up all the Shapes-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Shapes table.
 */
async function setRoutes(supabase, router) {
  // TODO

  /*
   * Purpose: Retrieves a promise for Shapes data.
   */
  function getData(...tableRefs) {
    return supabase.from("Shapes").select(appendTableRefs(fields, tableRefs));
  }
}

export { fields, setRoutes };
