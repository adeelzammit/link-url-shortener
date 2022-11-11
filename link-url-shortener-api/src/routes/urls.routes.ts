// urls route module.
import { Request, Response } from "express";
import HttpStatus from "http-status-codes";
import Mapping from "../models/mappings.models";
import express from "express";
import bodyParser from "body-parser";

const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Get historical mappings related to the user
router.get("/", async (req: Request, res: Response) => {
  const { anonUserUUID } = req.cookies;
  const historicalMappings = await Mapping.find({
    userID: { $eq: anonUserUUID },
  });
  return res.status(HttpStatus.OK).json(historicalMappings);
});

// Don't delete the records themselves but just delete userID reference's to the mappings
router.delete("/history", async (req: Request, res: Response) => {
  const { anonUserUUID } = req.cookies;
  const deletedMappings = await Mapping.updateMany(
    {
      userID: { $eq: anonUserUUID },
    },
    { userID: null }
  );
  return res.status(HttpStatus.NO_CONTENT).json(deletedMappings);
});

module.exports = router;
