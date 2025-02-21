/*
 * Purpose: To form routes for Shapes data.
 */

import { handleQueryResults } from "./dataHandling.mjs";
import { DataGetter } from "./dataRetrieval.mjs";

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
  // TODO
}

export { fields, setRoutes, tableName };
