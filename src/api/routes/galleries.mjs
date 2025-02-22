/*
 * Purpose: To form routes for Galleries data.
 */

import { generateDefaultRoute, handleQueryResults } from "../dataHandling.mjs";
import { DataGetter } from "../dataRetrieval.mjs";
import { setParamInt } from "../routeParse.mjs";

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
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Galleries";

/*
 * Purpose: Sets up all the Galleries-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Galleries table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");
  generateDefaultRoute(router, dataGetter);

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("galleryId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/country/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("galleryCountry", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
