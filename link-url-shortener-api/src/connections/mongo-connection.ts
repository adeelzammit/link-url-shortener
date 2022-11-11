import * as General from "../util/general";
import mongoose from "mongoose";

const {
  MONGO_PORT,
  MONGO_HOSTNAME,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DB_NAME,
} = General.setEnvironmentVariables();

class MongoClient {
  Client?: any;
  constructor() {
    this.Client = null;
  }

  async connect() {
    this.Client = await mongoose.connect(
      `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB_NAME}?authSource=admin`
    );
    return this.Client;
  }
}

export default new MongoClient();
