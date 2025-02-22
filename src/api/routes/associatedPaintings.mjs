/*
 * Purpose: To form routes for getting Paintings data related to other data.
 *
 * Details: Say one wants to get Paintings associated with a given Artist. That
 * would be done in this module.
 */

import { handleQueryResults } from "../dataHandling.mjs";
import { DataGetter } from "../dataRetrieval.mjs";
import { setParamInt } from "../routeParse.mjs";
import { fields, tableName } from "./paintings.mjs";
import { TableRef } from "../tableRef.mjs";

/*
 * Purpose: Provides the names of the most important user-facing fields for
 * Paintings.
 */
const majorFields = `
  paintingId,
  title,
  yearOfWork
`;

/*
 * Purpose: Sets up all the Paintings-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Paintings table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");

  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("galleryId", req.intParams.ref)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/artist/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("artistId", req.intParams.ref)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/artists/country/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("Artists.nationality", `${req.params.substring}%`)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/genre/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get(majorFields, new TableRef("PaintingGenres"))
      .eq("PaintingGenres.genreId", req.intParams.ref)
      .order("yearOfWork");

    handleQueryResults(resp, data, error);
  });

  router.get("/era/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get(majorFields, new TableRef("PaintingGenres").addInnerRef("Genres"))
      .eq("PaintingGenres.Genres.eraId", req.intParams.ref)
      .order("yearOfWork");

    handleQueryResults(resp, data, error);
  });
}

export { setRoutes };
