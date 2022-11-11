"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnvironmentVariables = exports.aliasRegexExpression = exports.domainRegexExpression = exports.GENERIC_ERROR_MESSAGE = exports.INITIAL_REDIS_COUNTER_VALUE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.INITIAL_REDIS_COUNTER_VALUE = { count: 1, increment: 10 };
exports.GENERIC_ERROR_MESSAGE = "Could not fetch a shortURL, Please try again";
exports.domainRegexExpression = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;
exports.aliasRegexExpression = /^[A-Za-z0-9 ]+$/;
const setEnvironmentVariables = () => {
    const API_PORT = process.env.API_PORT || 8000;
    const API_HOSTNAME = process.env.API_HOSTNAME || "localhost";
    const UI_PORT = process.env.UI_PORT || 3000;
    const UI_HOSTNAME = process.env.UI_HOSTNAME || "localhost";
    const MONGO_PORT = process.env.MONGO_PORT || 3000;
    const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME || "localhost";
    const REDIS_PORT = process.env.REDIS_PORT || 6379;
    const REDIS_HOSTNAME = process.env.REDIS_HOSTNAME || "localhost";
    const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
    const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
    const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "";
    return {
        API_PORT,
        API_HOSTNAME,
        UI_PORT,
        UI_HOSTNAME,
        MONGO_PORT,
        MONGO_HOSTNAME,
        REDIS_PORT,
        REDIS_HOSTNAME,
        MONGO_USERNAME,
        MONGO_PASSWORD,
        MONGO_DB_NAME,
    };
};
exports.setEnvironmentVariables = setEnvironmentVariables;
module.exports = {
    setEnvironmentVariables: exports.setEnvironmentVariables,
    INITIAL_REDIS_COUNTER_VALUE: exports.INITIAL_REDIS_COUNTER_VALUE,
    domainRegexExpression: exports.domainRegexExpression,
    aliasRegexExpression: exports.aliasRegexExpression,
};
