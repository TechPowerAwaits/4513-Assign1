/*
 * Purpose: To form routes for Galleries data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";

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
  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await getData().eq("galleryId", req.params.ref);

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
  function getData() {
    return supabase.from("Galleries").select(fields);
  }
}

export { fields, setRoutes };
