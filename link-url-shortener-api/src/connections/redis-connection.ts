import "isomorphic-fetch";
import { createClient } from "redis";
import * as General from "../util/general";

const { REDIS_PORT, REDIS_HOSTNAME } = General.setEnvironmentVariables();

class RedisClient {
  Client?: any;
  constructor() {
    this.Client = null;
  }

  async connect() {
    this.Client = createClient({
      socket: {
        port: Number(REDIS_PORT),
        host: REDIS_HOSTNAME,
      },
    });
    await this.Client.connect();
    return this.Client;
  }
}

export default new RedisClient();
