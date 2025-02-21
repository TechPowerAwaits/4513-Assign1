/*
 * Purpose: To form routes for Genres data.
 */

import { appendTableRefs, handleQueryResults } from "./RouteCommon.mjs";
import { fields as erasFields } from "./Eras.mjs";
import { TableRef } from "./TableRef.mjs";

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
  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await getData().eq("genreId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/painting/:ref", async (req, resp) => {
    const { data, error } = await getData(new TableRef("PaintingGenres"))
      .eq("PaintingGenres.paintingId", req.intParams.ref)
      .order("genreName", { ascending: true });

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Genres data.
   */
  function getData(...tableRefs) {
    return supabase.from("Genres").select(appendTableRefs(fields, tableRefs));
  }
}

export { fields, setRoutes };
