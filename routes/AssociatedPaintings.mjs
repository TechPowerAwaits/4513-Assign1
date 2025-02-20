/*
 * Purpose: To form routes for getting Paintings data related to other data.
 *
 * Details: Say one wants to get Paintings associated with a given Artist. That
 * would be done in this module.
 */

import {
  appendTableRefs,
  enforceParamInteger,
  handleQueryResults,
} from "./RouteCommon.mjs";

import { fields } from "./Paintings.mjs";
import { TableRef } from "./TableRef.mjs";

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
  enforceParamInteger(router, "ref");

  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await getData()
      .eq("galleryId", req.intParams.ref)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/artist/:ref", async (req, resp) => {
    const { data, error } = await getData()
      .eq("artistId", req.intParams.ref)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/artists/country/:substring", async (req, resp) => {
    const { data, error } = await getData()
      .ilike("Artists.nationality", `${req.params.substring}%`)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/genre/:ref", async (req, resp) => {
    const { data, error } = await getData(majorFields, "PaintingGenres")
      .eq("PaintingGenres.genreId", req.intParams.ref)
      .order("yearOfWork");

    handleQueryResults(resp, data, error);
  });

  router.get("/era/:ref", async (req, resp) => {
    const { data, error } = await getData(
      majorFields,
      new TableRef("PaintingGenres").addInnerRef("Genres")
    )
      .eq("PaintingGenres.Genres.eraId", req.intParams.ref)
      .order("yearOfWork");

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Paintings data.
   */
  function getData(desiredFields = fields, ...tableRefs) {
    return supabase
      .from("Paintings")
      .select(appendTableRefs(desiredFields, tableRefs));
  }
}

export { setRoutes };
