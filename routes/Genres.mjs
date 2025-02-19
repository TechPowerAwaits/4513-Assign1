/*
 * Purpose: To form routes for Genres data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";
import { fields as erasFields } from "./Eras.mjs";

/*
 * Purpose: Provides the names of all the fields in the Genres table.
 */
const fields = `
	genreId,
	genreName,
	Eras!inner(${erasFields}),
	description,
	wikiLink
`;

/*
 * Purpose: Sets up all the Genres-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Genres table.
 */
async function setRoutes(supabase, router) {
  // TODO

  /*
   * Purpose: Retrieves a promise for Genres data.
   */
  function getData() {
    return supabase.from("Genres").select(fields);
  }
}

export { fields, setRoutes };
