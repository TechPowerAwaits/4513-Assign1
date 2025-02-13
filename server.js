import express from "express";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
const app = express();

const apiRouter = express.Router();

apiRouter.get("/eras", async (req, resp) => {
  const { data, error } = await supabase
    .from("Eras")
    .select("eraId, eraName, eraYears");

  if (error) {
    console.error(error);
  } else {
    resp.send(data);
  }
});

apiRouter.get("/galleries", async (req, resp) => {
  const { data, error } = await supabase
    .from("Galleries")
    .select(
      "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
    );

  if (error) {
    console.error(error);
  } else {
    resp.send(data);
  }
});

apiRouter.get("/galleries/:ref", async (req, resp) => {
  const { data, error } = await supabase
    .from("Galleries")
    .select(
      "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
    )
    .eq("galleryId", req.params.ref);

  if (error) {
    console.error(error);
  } else {
    resp.send(data);
  }
});

apiRouter.get("/galleries/country/:substring", async (req, resp) => {
  const { data, error } = await supabase
    .from("Galleries")
    .select(
      "galleryId, galleryName, galleryNativeName, galleryCity, galleryAddress, galleryCountry, latitude, longitude, galleryWebSite, flickrPlaceId, yahooWoeId, googlePlaceId"
    )
    .ilike("galleryCountry", `${req.params.substring}%`);

  if (error) {
    console.error(error);
  } else {
    resp.send(data);
  }
});

app.use("/api", apiRouter);

app.listen(process.env.PORT);
