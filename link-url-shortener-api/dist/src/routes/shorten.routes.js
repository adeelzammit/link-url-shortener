"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const node_cache_1 = __importDefault(require("node-cache"));
const cache_keys_1 = require("../util/cache-keys");
const redis_connection_1 = __importDefault(require("../connections/redis-connection"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const crypto_1 = __importDefault(require("crypto"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mappings_models_1 = __importDefault(require("../models/mappings.models"));
const general_1 = require("../util/general");
const base62 = require("base62/lib/ascii");
const router = express_1.default.Router();
const cache = new node_cache_1.default();
// Here we are configuring express to use body-parser as middle-ware.
router.use(body_parser_1.default.urlencoded({ extended: false }));
router.use(body_parser_1.default.json());
const saveNewMapping = (body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body.expiration) {
        body.expiration = (0, moment_1.default)().add(3, "months").unix();
    }
    const newMapping = new mappings_models_1.default(Object.assign({}, body));
    const insertedMapping = yield newMapping.save();
    return insertedMapping;
});
const generateShortURL = (inMemCounter) => __awaiter(void 0, void 0, void 0, function* () {
    //hash: Counter -> Base64 encoding -> Hash -> Get first 7 chars
    let shortURL = inMemCounter.count;
    shortURL = base62.encode(shortURL);
    shortURL = crypto_1.default.createHash("sha1").update(shortURL).digest("hex");
    shortURL = shortURL.substring(0, 6);
    // update cache
    if (inMemCounter.count > Number.MAX_SAFE_INTEGER) {
        inMemCounter = general_1.INITIAL_REDIS_COUNTER_VALUE;
    }
    else {
        inMemCounter.count = inMemCounter.count + 1;
    }
    yield cache.set(cache_keys_1.CacheKeysEnum.COUNTER, JSON.stringify(inMemCounter));
    return shortURL;
});
const checkIfValidRequestData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    // check if domain name was given
    const domainRegex = new RegExp(general_1.domainRegexExpression);
    if (!body.originalURL.match(domainRegex)) {
        return [
            false,
            { errors: { originalURL: "The URL that was given is not valid" } },
        ];
    }
    if (body.alias) {
        const aliasRegex = new RegExp(general_1.aliasRegexExpression);
        if (!body.alias.match(aliasRegex)) {
            return [
                false,
                { errors: { alias: "The alias was given in an invalid format" } },
            ];
        }
        const count = yield mappings_models_1.default.countDocuments({ alias: body.alias });
        if (count > 0) {
            return [
                false,
                { errors: { alias: "This alias has already been taken" } },
            ];
        }
    }
    // Valid
    return [true, { errors: {} }];
});
const updateCounterRange = (parsedCounterValue) => {
    // This range is the valid range for which the API can make shortened URLs from
    // e.g. if increment is 100 then api can make shortened URLs from 1 - 101 before talking to redis to update it before using ranges 101-200
    parsedCounterValue.count =
        parsedCounterValue.count + parsedCounterValue.increment;
    return parsedCounterValue;
};
const updateCounterInRedis = (newCounterValue) => __awaiter(void 0, void 0, void 0, function* () {
    // Update redis with the new increment range
    const updatedCounterValue = yield redis_connection_1.default.Client.set(cache_keys_1.CacheKeysEnum.COUNTER, JSON.stringify(newCounterValue));
    if (updatedCounterValue === "OK") {
        yield cache.set(cache_keys_1.CacheKeysEnum.COUNTER, JSON.stringify(newCounterValue));
    }
    else {
        return [false, { errors: { alias: general_1.GENERIC_ERROR_MESSAGE } }];
    }
    return [true, { errors: {} }];
});
const determineIfStaleCounter = () => __awaiter(void 0, void 0, void 0, function* () {
    // If the count is over the interval, get from cache
    const inMemCounter = cache.get(cache_keys_1.CacheKeysEnum.COUNTER);
    if (!inMemCounter) {
        return [false, { errors: { alias: general_1.GENERIC_ERROR_MESSAGE } }];
    }
    let parsedInMemCounter = JSON.parse(inMemCounter);
    // Update redis cache if we exhausted the allocated range.
    // Only avoid when counter is 1
    if (parsedInMemCounter.count % parsedInMemCounter.increment === 1 &&
        parsedInMemCounter.count !== 1) {
        return yield updateCounterInRedis(parsedInMemCounter);
    }
    return [true, { errors: {} }];
});
const setCounterinAPIMemCache = () => __awaiter(void 0, void 0, void 0, function* () {
    const counterValue = yield redis_connection_1.default.Client.get(cache_keys_1.CacheKeysEnum.COUNTER);
    let newCounterValue = null;
    const doesRedisHaveCachedCounter = !!counterValue;
    if (!doesRedisHaveCachedCounter) {
        // Set new counter amount
        newCounterValue = general_1.INITIAL_REDIS_COUNTER_VALUE;
    }
    else {
        // Update counter amount
        const parsedCounterValue = JSON.parse(counterValue);
        newCounterValue = updateCounterRange(parsedCounterValue);
    }
    // Update counter in redis to avoid redis giving old counter to another api server
    return yield updateCounterInRedis(newCounterValue);
});
//Better written code hopefully
router.post("/", (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = request;
    // 0: change url mapping and originalURL to be lowercase and get rid of leading and trailing whitespace
    body.alias = body.alias ? body.alias.toLowerCase().trim() : body.alias;
    body.originalURL = body.originalURL
        ? body.originalURL.toLowerCase().trim()
        : body.originalURL;
    // 1: General Validation Check
    const [isValidRequest, requestErrorMessages] = yield checkIfValidRequestData(body);
    if (!isValidRequest) {
        response.set("Content-Type", "application/problem+json");
        return response.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(Object.assign(Object.assign({}, body), requestErrorMessages));
    }
    // 2: Check if Not logged In and and cookie anonUserUUID to be the user instead
    // NB: log in functionality is not implmented but is a future consideration
    const { anonUserUUID } = request.cookies;
    if (!body.userID) {
        body.userID = anonUserUUID;
    }
    // 3: Determine Type of shortened URL request - alias given or to randomly generate
    if (body.alias) {
        return yield response
            .status(http_status_codes_1.default.CREATED)
            .json(yield saveNewMapping(body));
    }
    // 4: Determine if counter from redis memory cache doesn't exist within api local mem cache
    // If not, get the new counter
    const doesApiHaveCachedCounter = cache.has(cache_keys_1.CacheKeysEnum.COUNTER);
    if (!doesApiHaveCachedCounter) {
        const [apiCounterWasSet, apiCounterSetErrors] = yield setCounterinAPIMemCache();
        if (!apiCounterWasSet) {
            response.set("Content-Type", "application/problem+json");
            return response.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(Object.assign(Object.assign({}, body), apiCounterSetErrors));
        }
    }
    else {
        // 5: check if the counter is stale if it already exists
        const [apiCounterWasUpdated, apiCounterUpdateErrors] = yield determineIfStaleCounter();
        if (!apiCounterWasUpdated) {
            response.set("Content-Type", "application/problem+json");
            return response.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(Object.assign(Object.assign({}, body), apiCounterUpdateErrors));
        }
    }
    // 5. Finally generate the short URL
    const validatedCounterValue = yield cache.get(cache_keys_1.CacheKeysEnum.COUNTER);
    if (validatedCounterValue) {
        body.alias = yield generateShortURL(JSON.parse(validatedCounterValue));
        return response.status(http_status_codes_1.default.CREATED).json(yield saveNewMapping(body));
    }
    // Somehow, all this effort and still nothing was set on the cache!
    response.set("Content-Type", "application/problem+json");
    return response.status(http_status_codes_1.default.UNPROCESSABLE_ENTITY).json(Object.assign(Object.assign({}, body), { errors: { alias: general_1.GENERIC_ERROR_MESSAGE } }));
}));
module.exports = router;
