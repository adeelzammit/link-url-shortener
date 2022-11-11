// state route module.
import { Request, Response } from "express";
import express from "express";
import { v4 as uuidv4 } from "uuid";
import HttpStatus from "http-status-codes";
import { CacheKeysEnum } from "../util/cache-keys";
// import moment from "moment";

const router = express.Router();
router.get("/", async (req: Request, res: Response) => {
  const { anonUserUUID } = req.cookies;
  if (!!!anonUserUUID) {
    // no cookie: set a new cookie
    let cookie = uuidv4();
    res.cookie(CacheKeysEnum.ANON_USER, cookie, {
      // Commenting out for now
      //   maxAge: moment().add(1, "year").unix(),
    });
    // no: cookie not present, return this state
    return res.status(HttpStatus.OK).json({ user: [cookie] });
  } else {
    // yes: cookie was already present, return this state
    return res.status(HttpStatus.OK).json({ user: [anonUserUUID] });
  }
});

module.exports = router;
