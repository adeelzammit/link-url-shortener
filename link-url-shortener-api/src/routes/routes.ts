import express, { Express } from "express";
const shorten = require("./shorten.routes");
const urls = require("./urls.routes");
const state = require("./state.routes");
const app: Express = express();

app.use("/shorten", shorten);
app.use("/urls", urls);
app.use("/state", state);

export default app;
