import express, { Express } from "express";
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import moment from "moment";
import Mapping from "../models/mappings.models";
import * as General from "../util/general";

const app: Express = express();

const { UI_PORT, UI_HOSTNAME } = General.setEnvironmentVariables();

app.get("/ping", (req: Request, res: Response) =>
  res.status(HttpStatus.OK).send("PONG")
);

// catch favicon.ico as it passes to /:shortURL
app.get("/favicon.ico", (req: Request, res: Response) =>
  res.status(HttpStatus.NO_CONTENT)
);

app.get("/:shortURL", async (req: Request, res: Response) => {
  const foundMapping = await Mapping.findOne({
    alias: req.params.shortURL,
  });
  if (foundMapping) {
    //check expiration date
    const currentTimeNow = moment().unix();
    if (currentTimeNow > foundMapping.expiration) {
      //Expired
      await Mapping.deleteOne({
        alias: req.params.shortURL,
      });
    }
    // If without http://, append it
    if (
      !foundMapping.originalURL.includes("://") &&
      !foundMapping.originalURL.startsWith("/")
    ) {
      res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect("http://" + foundMapping.originalURL);
    } else {
      res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect(foundMapping.originalURL);
    }
  } else {
    // Couldn't find mapping, redirect
    res
      .status(HttpStatus.PERMANENT_REDIRECT)
      .redirect(`http://${UI_HOSTNAME}:${UI_PORT}`);
  }
});

export default app;
