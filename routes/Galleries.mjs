/*
 * Purpose: To form routes for Galleries data.
 */

import { appendTableRefs, handleQueryResults } from "./RouteCommon.mjs";
import { setParamInt } from "./routeParse.mjs";

/*
 * Purpose: Provides the names of all the fields in the Galleries table.
 */
const fields = `
  galleryId,
  galleryName,
  galleryNativeName,
  galleryCity,
  galleryAddress,
  galleryCountry,
  latitude,
  longitude,
  galleryWebSite,
  flickrPlaceId,
  yahooWoeId,
  googlePlaceId
`;

/*
 * Purpose: Sets up all the Galleries-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Galleries table.
 */
async function setRoutes(supabase, router) {
  setParamInt(router, "ref");

  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await getData().eq("galleryId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/country/:substring", async (req, resp) => {
    const { data, error } = await getData().ilike(
      "galleryCountry",
      `${req.params.substring}%`
    );

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Galleries data.
   */
  function getData(...tableRefs) {
    return supabase
      .from("Galleries")
      .select(appendTableRefs(fields, tableRefs));
  }
}

export { fields, setRoutes };
