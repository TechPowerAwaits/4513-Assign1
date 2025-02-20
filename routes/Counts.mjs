/*
 * Purpose: To form routes for counting data.
 */

import { enforceParamInteger, handleQueryResults } from "./RouteCommon.mjs";

/*
 * Purpose: Sets up all the Counting-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for counting.
 */
async function setRoutes(supabase, router) {
  enforceParamInteger(router, "ref");

  router.get("/genres", async (req, resp) => {
    const { data, error } = await supabase
      .rpc("get_genres")
      .order("count", { ascending: true });

    handleQueryResults(resp, data, error);
  });

  router.get("/artists", async (req, resp) => {
    // Makes use of a computed field:
    // https://postgrest.org/en/stable/references/api/computed_fields.html
    // The example in the document was only modified slightly
    // (if not broke, why fix it?).
    const { data, error } = await supabase
      .from("Paintings")
      .select(
        `...Artists(artistName),
		paintingId.count()`
      )
      .order("count", { ascending: false });

    handleQueryResults(resp, data, error);
  });

  router.get("/topgenres/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .rpc("get_genres_above", { pcount: req.intParams.ref })
      .order("count", { ascending: false });

    handleQueryResults(resp, data, error);
  });
}

export { setRoutes };
