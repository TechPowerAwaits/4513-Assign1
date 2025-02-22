/*
 * Purpose: To form routes for Genres data.
 */

import { generateDefaultRoute, handleQueryResults } from "../dataHandling.mjs";
import { DataGetter } from "../dataRetrieval.mjs";
import { setParamInt } from "../routeParse.mjs";
import { fields as erasFields } from "./eras.mjs";
import { TableRef } from "../tableRef.mjs";

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
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Genres";

/*
 * Purpose: Sets up all the Genres-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Genres table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");
  generateDefaultRoute(router, dataGetter);

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("genreId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/painting/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get(fields, new TableRef("PaintingGenres"))
      .eq("PaintingGenres.paintingId", req.intParams.ref)
      .order("genreName", { ascending: true });

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
