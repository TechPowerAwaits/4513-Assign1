/*
 * Purpose: To start up the server.
 */

import express from "express";
import { setRoutes as setApiRoutes } from "./api/api.mjs";
import { errorMessages } from "./errorMsg.mjs";

const app = express();

const apiRouter = express.Router();
await setApiRoutes(apiRouter);

app.use("/api", apiRouter);

// Thanks to Express's FAQ for mentioning how to handle 404 Errors.
// https://expressjs.com/en/starter/faq.html
app.use((req, resp, next) => {
  errorMessages["notFound"].sendHTML(resp);
});

app.listen(process.env.PORT || 10000);
