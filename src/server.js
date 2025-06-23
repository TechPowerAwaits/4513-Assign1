/*
 * Purpose: To start up the server.
 */

import { fileURLToPath } from "node:url";
import express from "express";
import { setRoutes as setApiRoutes } from "./api/api.mjs";
import { errorMessages } from "./errorMsg.mjs";
import { corsAllowGet } from "./api/cors.mjs";

const app = express();

const apiRouter = express.Router();
apiRouter.use(corsAllowGet);
await setApiRoutes(apiRouter);

app.use("/api", apiRouter);

// Serves the HTML version of the README if it exists.
// Else, serves an appropriate error response.
app.get("/", (req, resp, next) => {
  resp.sendFile(
    fileURLToPath(new URL(`../gen/README.html`, import.meta.url)),
    (err) => {
      if (err) {
        errorMessages["missingResource"].sendHTML(resp);
      }
    }
  );
});

// Thanks to Express's FAQ for mentioning how to handle 404 Errors.
// https://expressjs.com/en/starter/faq.html
app.use((req, resp, next) => {
  errorMessages["notFound"].sendHTML(resp);
});

app.listen(process.env.PORT || 10000);
