/*
 * Purpose: To form routes for Paintings data.
 */

import { generateDefaultRoute, handleQueryResults } from "./dataHandling.mjs";
import { DataGetter } from "./dataRetrieval.mjs";
import { checkRange, setParamInt } from "./routeParse.mjs";
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
 * Purpose: Provides the name of the table being targeted.
 */
const tableName = "Paintings";

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
  checkRange(router, "start", "end");
  generateDefaultRoute(router, dataGetter);

  router.get("/sort/title", async (req, resp) => {
    const { data, error } = await dataGetter.get().order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/sort/year", async (req, resp) => {
    const { data, error } = await dataGetter.get().order("yearOfWork");

    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("paintingId", req.intParams.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/search/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("title", `%${req.params.substring}%`)
      .order("title");

    handleQueryResults(resp, data, error);
  });

  router.get("/years/:start/:end", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .gte("yearOfWork", req.intParams.start)
      .lte("yearOfWork", req.intParams.end)
      .order("yearOfWork");

    handleQueryResults(resp, data, error);
  });
}

export { fields, setRoutes, tableName };
