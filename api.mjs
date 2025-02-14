import { ErrorMsg, errorMessages } from "./ErrorMsg.mjs";

import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

async function setApiRoutes(router) {
  router.get("/eras", async (req, resp) => {
    const { data, error } = await supabase
      .from("Eras")
      .select("eraId, eraName, eraYears");

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      );

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      )
      .eq("galleryId", req.params.ref);

    handleQueryResults(resp, data, error);
  });

  router.get("/galleries/country/:substring", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      )
      .ilike("galleryCountry", `${req.params.substring}%`);

    handleQueryResults(resp, data, error);
  });

  router.get("/artists", async (req, resp) => {
    const { data, error } = await supabase
      .from("Artists")
      .select(
        "artistId, firstName, lastName, nationality, gender, yearOfBirth, yearOfDeath, details, artistLink"
      );

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
