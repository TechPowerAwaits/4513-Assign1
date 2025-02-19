/*
 * Purpose: To form routes for Paintings data.
 */

import { handleQueryResults } from "./RouteCommon.mjs";
import { fields as artistFields } from "./Artists.mjs";
import { fields as galleryFields } from "./Galleries.mjs";
import { fields as shapeFields } from "./Shapes.mjs";

/*
 * Purpose: Provides the names of all the fields in the Paintings table.
 */
const fields = `
  paintingId,
  Artists!inner(${artistFields}),
  Galleries!inner(${galleryFields}),
  imageFileName,
  title,
  Shapes!inner(${shapeFields}),
  museumLink,
  accessionNumber,
  copyrightText,
  description,
  excerpt,
  yearOfWork,
  width,
  height,
  medium,
  cost,
  MSRP,
  googleLink,
  googleDescription,
  wikiLink,
	jsonAnnotations
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
  router.get("/", async (req, resp) => {
    const { data, error } = await getData();

    handleQueryResults(resp, data, error);
  });

  router.get("/sort/title", async (req, resp) => {
    const { data, error } = await getData().order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/sort/year", async (req, resp) => {
    const { data, error } = await getData().order("yearOfWork");

    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Retrieves a promise for Paintings data.
   */
  function getData() {
    return supabase.from("Paintings").select(fields);
  }
}

export { fields, setRoutes };
