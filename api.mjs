import { ErrorMsg, errorMessages } from "./ErrorMsg.mjs";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setApiRoutes(router) {
  const eraFields = `
    eraId,
    eraName,
    eraYears
  `;
  const galleryFields = `
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
  const artistFields = `
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
  const shapeFields = `
    shapeId,
    shapeName
  `;
  const paintingFields = `
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

  router.get("/eras", async (req, resp) => {
    const { data, error } = await supabase.from("Eras").select(`${eraFields}`);

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(`${galleryFields}`);

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(`${galleryFields}`)
      .eq("galleryId", req.params.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries/country/:substring", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(`${galleryFields}`)
      .ilike("galleryCountry", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });

  router.get("/artists", async (req, resp) => {
    const { data, error } = await supabase
      .from("Artists")
      .select(`${artistFields}`);

    handleQueryResults(resp, data, error);
  });

  router.get("/artists/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .from("Artists")
      .select(`${artistFields}`)
      .eq("artistId", req.params.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/artists/search/:substring", async (req, resp) => {
    const { data, error } = await supabase
      .from("Artists")
      .select(`${artistFields}`)
      .ilike("lastName", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });

  router.get("/artists/country/:substring", async (req, resp) => {
    const { data, error } = await supabase
      .from("Artists")
      .select(`${artistFields}`)
      .ilike("nationality", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });

  router.get("/paintings", async (req, resp) => {
    const { data, error } = await supabase
      .from("Paintings")
      .select(`${paintingFields}`);

    handleQueryResults(resp, data, error);
  });
}

/*
 * Purpose: Handles the results of querying for data.
 */
function handleQueryResults(resp, data, error = null) {
  if (error) {
    handleInternalError(resp, error);
  } else if (data.length == 0) {
    handleNoDataError(resp);
  } else {
    resp.send(data);
  }

  function handleInternalError(resp, error) {
    console.error(error);
    resp.status(500).send(new ErrorMsg(errorMessages["internal"]));
  }

  function handleNoDataError(resp) {
    resp.status(404).send(new ErrorMsg(errorMessages["noData"]));
  }
}

export { setApiRoutes };
