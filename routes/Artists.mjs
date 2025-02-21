/*
 * Purpose: To form routes for Artists data.
 */

import { generateDefaultRoute, handleQueryResults } from "./dataHandling.mjs";
import { DataGetter } from "./dataRetrieval.mjs";
import { setParamInt } from "./routeParse.mjs";

/*
 * Purpose: Provides the names of all the fields in the Artists table.
 */
const fields = `
  artistId,
  firstName,
  lastName,
  nationality,
  gender,
  yearOfBirth,
  yearOfDeath,
  details,
	artistLink
`;

/*
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Artists";

/*
 * Purpose: Sets up all the Artists-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Artists table.
 */
async function setRoutes(supabase, router) {
  const dataGetter = new DataGetter(supabase, tableName, fields);
  setParamInt(router, "ref");
  generateDefaultRoute(router, dataGetter);

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("artistId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/search/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("lastName", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });

  router.get("/country/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("nationality", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
