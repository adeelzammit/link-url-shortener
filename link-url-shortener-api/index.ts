import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import mongoConnection from "./src/connections/mongo-connection";
import redisConnection from "./src/connections/redis-connection";
import globalRoutes from "./src/routes/global.routes";
import routes from "./src/routes/routes";
import * as General from "./src/util/general";

const app: Express = express();

const { API_PORT, API_HOSTNAME, UI_PORT, UI_HOSTNAME } =
  General.setEnvironmentVariables();

const hookMiddleWare = () => {
  // Enables all cors requests from UI domain
  // Credentials: true allow the use of Cookies
  app.use(
    cors({ credentials: true, origin: `http://${UI_HOSTNAME}:${UI_PORT}` })
  );

  // Allows the use of cookies in the application
  app.use(cookieParser());

  // Use the specified routes
  app.use("/", globalRoutes);
  app.use("/api", routes);
};

const connectToMongo = async () => {
  await mongoConnection.connect();
};

const connectToRedis = async () => {
  await redisConnection.connect();
};

const runServer = async () => {
  try {
    hookMiddleWare();
    connectToMongo();
    connectToRedis();

    app.listen(API_PORT, () => {
      console.log(
        `⚡️[server]: Server is running at http://${API_HOSTNAME}:${API_PORT}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runServer();
