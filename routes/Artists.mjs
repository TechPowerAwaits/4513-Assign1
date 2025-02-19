/*
 * Purpose: To form routes for Artists data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";

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
 * Purpose: Sets up all the Artists-related routes.
 *
 * Details: The supabase object must be initialized with a valid database.
 *
 * The router provided must point to a path unique for data retrieved for the
 * Artists table.
 */
async function setRoutes(supabase, router) {
  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await getData().eq("artistId", req.params.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/search/:substring", async (req, resp) => {
    const { data, error } = await getData().ilike(
      "lastName",
      `${req.params.substring}%`
    );

    handleQueryResults(resp, data, error);
  });

  router.get("/country/:substring", async (req, resp) => {
    const { data, error } = await getData().ilike(
      "nationality",
      `${req.params.substring}%`
    );

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Artists data.
   */
  function getData() {
    return supabase.from("Artists").select(fields);
  }
}

export { fields, setRoutes };
