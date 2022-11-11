// shorten route module.
import { Request, Response } from "express";
import moment from "moment";
import NodeCache from "node-cache";
import { CacheKeysEnum } from "../util/cache-keys";
import redisConnection from "../connections/redis-connection";
import express from "express";
import bodyParser from "body-parser";
import crypto from "crypto";
import HttpStatus from "http-status-codes";
import Mapping from "../models/mappings.models";
import {
  domainRegexExpression,
  aliasRegexExpression,
  GENERIC_ERROR_MESSAGE,
  INITIAL_REDIS_COUNTER_VALUE,
} from "../util/general";

const base62 = require("base62/lib/ascii");
const router = express.Router();
const cache = new NodeCache();

// Here we are configuring express to use body-parser as middle-ware.
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const saveNewMapping = async (body: any) => {
  if (!body.expiration) {
    body.expiration = moment().add(3, "months").unix();
  }
  const newMapping = new Mapping({ ...body });
  const insertedMapping = await newMapping.save();
  return insertedMapping;
};

const generateShortURL = async (inMemCounter: any) => {
  //hash: Counter -> Base64 encoding -> Hash -> Get first 7 chars
  let shortURL = inMemCounter.count;
  shortURL = base62.encode(shortURL);
  shortURL = crypto.createHash("sha1").update(shortURL).digest("hex");
  shortURL = shortURL.substring(0, 6);
  // update cache
  if (inMemCounter.count > Number.MAX_SAFE_INTEGER) {
    inMemCounter = INITIAL_REDIS_COUNTER_VALUE;
  } else {
    inMemCounter.count = inMemCounter.count + 1;
  }
  await cache.set(CacheKeysEnum.COUNTER, JSON.stringify(inMemCounter));
  return shortURL;
};

const checkIfValidRequestData = async (body: any) => {
  // check if domain name was given
  const domainRegex = new RegExp(domainRegexExpression);
  if (!body.originalURL.match(domainRegex)) {
    return [
      false,
      { errors: { originalURL: "The URL that was given is not valid" } },
    ];
  }

  if (body.alias) {
    const aliasRegex = new RegExp(aliasRegexExpression);
    if (!body.alias.match(aliasRegex)) {
      return [
        false,
        { errors: { alias: "The alias was given in an invalid format" } },
      ];
    }
    const count = await Mapping.countDocuments({ alias: body.alias });
    if (count > 0) {
      return [
        false,
        { errors: { alias: "This alias has already been taken" } },
      ];
    }
  }

  // Valid
  return [true, { errors: {} }];
};

const updateCounterRange = (parsedCounterValue: any) => {
  // This range is the valid range for which the API can make shortened URLs from
  // e.g. if increment is 100 then api can make shortened URLs from 1 - 101 before talking to redis to update it before using ranges 101-200
  parsedCounterValue.count =
    parsedCounterValue.count + parsedCounterValue.increment;
  return parsedCounterValue;
};

const updateCounterInRedis = async (newCounterValue: any) => {
  // Update redis with the new increment range
  const updatedCounterValue = await redisConnection.Client.set(
    CacheKeysEnum.COUNTER,
    JSON.stringify(newCounterValue)
  );

  if (updatedCounterValue === "OK") {
    await cache.set(CacheKeysEnum.COUNTER, JSON.stringify(newCounterValue));
  } else {
    return [false, { errors: { alias: GENERIC_ERROR_MESSAGE } }];
  }
  return [true, { errors: {} }];
};

const determineIfStaleCounter = async () => {
  // If the count is over the interval, get from cache
  const inMemCounter: any = cache.get(CacheKeysEnum.COUNTER);
  if (!inMemCounter) {
    return [false, { errors: { alias: GENERIC_ERROR_MESSAGE } }];
  }
  let parsedInMemCounter = JSON.parse(inMemCounter);

  // Update redis cache if we exhausted the allocated range.
  // Only avoid when counter is 1
  if (
    parsedInMemCounter.count % parsedInMemCounter.increment === 1 &&
    parsedInMemCounter.count !== 1
  ) {
    return await updateCounterInRedis(parsedInMemCounter);
  }
  return [true, { errors: {} }];
};

const setCounterinAPIMemCache = async () => {
  const counterValue = await redisConnection.Client.get(CacheKeysEnum.COUNTER);

  let newCounterValue = null;
  const doesRedisHaveCachedCounter: boolean = !!counterValue;
  if (!doesRedisHaveCachedCounter) {
    // Set new counter amount
    newCounterValue = INITIAL_REDIS_COUNTER_VALUE;
  } else {
    // Update counter amount
    const parsedCounterValue = JSON.parse(counterValue);
    newCounterValue = updateCounterRange(parsedCounterValue);
  }

  // Update counter in redis to avoid redis giving old counter to another api server
  return await updateCounterInRedis(newCounterValue);
};

//Better written code hopefully
router.post("/", async (request: Request, response: Response) => {
  const { body } = request;
  // 0: change url mapping and originalURL to be lowercase and get rid of leading and trailing whitespace
  body.alias = body.alias ? body.alias.toLowerCase().trim() : body.alias;
  body.originalURL = body.originalURL
    ? body.originalURL.toLowerCase().trim()
    : body.originalURL;

  // 1: General Validation Check
  const [isValidRequest, requestErrorMessages]: boolean | any =
    await checkIfValidRequestData(body);
  if (!isValidRequest) {
    response.set("Content-Type", "application/problem+json");
    return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      ...body,
      ...requestErrorMessages,
    });
  }

  // 2: Check if Not logged In and and cookie anonUserUUID to be the user instead
  // NB: log in functionality is not implmented but is a future consideration
  const { anonUserUUID } = request.cookies;
  if (!body.userID) {
    body.userID = anonUserUUID;
  }

  // 3: Determine Type of shortened URL request - alias given or to randomly generate
  if (body.alias) {
    return await response
      .status(HttpStatus.CREATED)
      .json(await saveNewMapping(body));
  }

  // 4: Determine if counter from redis memory cache doesn't exist within api local mem cache
  // If not, get the new counter
  const doesApiHaveCachedCounter: boolean = cache.has(CacheKeysEnum.COUNTER);
  if (!doesApiHaveCachedCounter) {
    const [apiCounterWasSet, apiCounterSetErrors]: boolean | any =
      await setCounterinAPIMemCache();
    if (!apiCounterWasSet) {
      response.set("Content-Type", "application/problem+json");
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        ...body,
        ...apiCounterSetErrors,
      });
    }
  } else {
    // 5: check if the counter is stale if it already exists
    const [apiCounterWasUpdated, apiCounterUpdateErrors]: boolean | any =
      await determineIfStaleCounter();
    if (!apiCounterWasUpdated) {
      response.set("Content-Type", "application/problem+json");
      return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
        ...body,
        ...apiCounterUpdateErrors,
      });
    }
  }

  // 5. Finally generate the short URL
  const validatedCounterValue: any = await cache.get(CacheKeysEnum.COUNTER);
  if (validatedCounterValue) {
    body.alias = await generateShortURL(JSON.parse(validatedCounterValue));
    return response.status(HttpStatus.CREATED).json(await saveNewMapping(body));
  }

  // Somehow, all this effort and still nothing was set on the cache!
  response.set("Content-Type", "application/problem+json");
  return response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
    ...body,
    errors: { alias: GENERIC_ERROR_MESSAGE },
  });
});

module.exports = router;
