import { setError } from "./error.mjs";

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

    if (error) {
      console.error(error);
      resp.status(500).send(setError(error));
    } else {
      resp.send(data);
    }
  });

  router.get("/galleries", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      );

    if (error) {
      console.error(error);
      resp.status(500).send(setError(error));
    } else {
      resp.send(data);
    }
  });

  router.get("/galleries/:ref", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      )
      .eq("galleryId", req.params.ref);

    if (error) {
      console.error(error);
      resp.status(500).send(setError(error));
    } else {
      resp.send(data);
    }
  });

  router.get("/galleries/country/:substring", async (req, resp) => {
    const { data, error } = await supabase
      .from("Galleries")
      .select(
        "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
      )
      .ilike("galleryCountry", `${req.params.substring}%`);

    if (error) {
      console.error(error);
      resp.status(500).send(setError(error));
    } else {
      resp.send(data);
    }
  });
}

export { setApiRoutes };
