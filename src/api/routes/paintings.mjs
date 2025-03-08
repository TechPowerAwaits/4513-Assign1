/*
 * Purpose: To form routes for Paintings data.
 */

import { handleQueryResults } from "../dataHandling.mjs";
import { DataGetter } from "../dataRetrieval.mjs";
import { checkRange, setParamInt } from "../routeParse.mjs";
import { fields as artistFields } from "./artists.mjs";
import { fields as galleryFields } from "./galleries.mjs";
import { fields as shapeFields } from "./shapes.mjs";
import { TableRef } from "../tableRef.mjs";

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
 * Purpose: Provides the names of the most important user-facing fields for
 * Paintings.
 */
const majorFields = `
  paintingId,
  title,
  yearOfWork
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

  await Promise.all([
    setBaseRoutes(dataGetter, router),
    setAssociatedRoutes(dataGetter, router),
  ]);
}

/*
 * Purpose: Sets up all the routes that directly involve Paintings.
 */
async function setBaseRoutes(dataGetter, router) {
  router.get("/", sendPaintingsByTitle);
  router.get("/sort/title", sendPaintingsByTitle);

  router.get("/sort/year", async (req, resp) => {
    const { data, error } = await dataGetter.get().order("yearOfWork");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  router.get("/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("paintingId", req.intParams.ref);

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  router.get("/search/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("title", `%${req.params.substring}%`)
      .order("title");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  router.get("/years/:start/:end", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .gte("yearOfWork", req.intParams.start)
      .lte("yearOfWork", req.intParams.end)
      .order("yearOfWork");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  /*
   * Purpose: Sends all Painting data in JSON format sorted by Painting title.
   */
  async function sendPaintingsByTitle(req, resp) {
    const { data, error } = await dataGetter.get().order("title");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  }
}

/*
 * Purpose: Sets up all the routes that use references to other tables.
 */
async function setAssociatedRoutes(dataGetter, router) {
  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("galleryId", req.intParams.ref)
      .order("title");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  router.get("/artist/:ref", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .eq("artistId", req.intParams.ref)
      .order("title");

    parseJSONAnnotations(data);
    handleQueryResults(resp, data, error);
  });

  router.get("/artists/country/:substring", async (req, resp) => {
    const { data, error } = await dataGetter
      .get()
      .ilike("Artists.nationality", `${req.params.substring}%`)
      .order("title");

    parseJSONAnnotations(data);
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

/*
 * Purpose: Modifies the given data object such that the jsonAnnotations
 * attribute is its own object.
 *
 * Details: It is assumed that if the first row doesn't contain a
 * jsonAnnotations field, none of the subsequent rows would contain one.
 */
function parseJSONAnnotations(data) {
  if (data.length > 0) {
    if (data[0]["jsonAnnotations"]) {
      data.forEach((row) => {
        row["jsonAnnotations"] = JSON.parse(row["jsonAnnotations"]);
      });
    } else {
      console.warn("Could not find jsonAnnotations field in data.");
    }
  }
}

export { fields, setRoutes, tableName };
