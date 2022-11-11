import dotenv from "dotenv";
dotenv.config();

export const INITIAL_REDIS_COUNTER_VALUE: any = { count: 1, increment: 10 };

export const GENERIC_ERROR_MESSAGE: string =
  "Could not fetch a shortURL, Please try again";

export const domainRegexExpression: any =
  /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/;

export const aliasRegexExpression: any = /^[A-Za-z0-9]+$/;

export const setEnvironmentVariables = () => {
  const API_PORT: string | number = process.env.API_PORT || 8000;
  const API_HOSTNAME: string = process.env.API_HOSTNAME || "localhost";
  const UI_PORT: string | number = process.env.UI_PORT || 3000;
  const UI_HOSTNAME: string = process.env.UI_HOSTNAME || "localhost";
  const MONGO_PORT: string | number = process.env.MONGO_PORT || 3000;
  const MONGO_HOSTNAME: string = process.env.MONGO_HOSTNAME || "localhost";
  const REDIS_PORT: string | number = process.env.REDIS_PORT || 6379;
  const REDIS_HOSTNAME: string = process.env.REDIS_HOSTNAME || "localhost";
  const MONGO_USERNAME: string = process.env.MONGO_USERNAME || "";
  const MONGO_PASSWORD: string = process.env.MONGO_PASSWORD || "";
  const MONGO_DB_NAME: string = process.env.MONGO_DB_NAME || "";

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

module.exports = {
  setEnvironmentVariables,
  INITIAL_REDIS_COUNTER_VALUE,
  domainRegexExpression,
  aliasRegexExpression,
};
