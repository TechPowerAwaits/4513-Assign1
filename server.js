import express from "express";
const app = express();

app.get("/test", (req, resp) => {
  resp.send({ test: "This is a test response." });
});

app.listen(process.env.PORT);
