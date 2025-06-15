/*
 * Purpose: To form routes for counting data.
 */

import { handleQueryResults } from "../dataHandling.mjs";
import { setParamInt } from "../routeParse.mjs";

/*
 * Purpose: Sets up all the Counting-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for counting.
 */
async function setRoutes(supabase, router) {
  setParamInt(router, "ref");

  // tag::uses-genrePaintingCount[]
  /* Makes use of get_genre_painting_count() as PostgREST has no support for a
   * having clause.
   */
  router.get("/genres", async (req, resp) => {
    const { data, error } = await supabase
      .rpc("get_genre_painting_count")
      .order("count", { ascending: true });

    handleQueryResults(resp, data, error);
  });
  // end::uses-genrePaintingCount[]

  // tag::uses-artistName[]
  /* Makes use of a computed field to easily get an artist's combined first-last name:
   * https://postgrest.org/en/stable/references/api/computed_fields.html
   */
  router.get("/artists", async (req, resp) => {
    const { data, error } = await supabase
      .from("Paintings")
      .select(
        `...Artists(artistName),
		paintingId.count()`
      )
      .order("count", { ascending: false });

    handleQueryResults(resp, data, error);
  });
  // end::uses-artistName[]

  // tag::uses-genrePaintingCount[]
  router.get("/topgenres/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .rpc("get_genre_painting_count_above", { pcount: req.intParams.ref })
      .order("count", { ascending: false });

    handleQueryResults(resp, data, error);
  });
  // end::uses-genrePaintingCount[]
}

export { setRoutes };
