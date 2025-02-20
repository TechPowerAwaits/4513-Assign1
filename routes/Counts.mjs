/*
 * Purpose: To form routes for counting data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";

/*
 * Purpose: Sets up all the Counting-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for counting.
 */
async function setRoutes(supabase, router) {
  router.get("/genres", async (req, resp) => {
    const { data, error } = await supabase
      .from("PaintingGenres")
      .select(
        `...Genres!inner(genreName),
		paintingId.count()`
      )
      .order("count", { ascending: true });

    handleQueryResults(resp, data, error);
  });
}

export { setRoutes };
