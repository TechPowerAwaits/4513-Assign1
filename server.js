import express from "express";
import { setRoutes as setApiRoutes } from "./api.mjs";

const app = express();

const apiRouter = express.Router();
await setApiRoutes(apiRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT || 10000);
