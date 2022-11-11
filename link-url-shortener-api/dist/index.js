"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const mongo_connection_1 = __importDefault(require("./src/connections/mongo-connection"));
const redis_connection_1 = __importDefault(require("./src/connections/redis-connection"));
const global_routes_1 = __importDefault(require("./src/routes/global.routes"));
const routes_1 = __importDefault(require("./src/routes/routes"));
const General = __importStar(require("./src/util/general"));
const app = (0, express_1.default)();
const { API_PORT, API_HOSTNAME, UI_PORT, UI_HOSTNAME } = General.setEnvironmentVariables();
const hookMiddleWare = () => {
    // Enables all cors requests from UI domain
    // Credentials: true allow the use of Cookies
    app.use((0, cors_1.default)({ credentials: true, origin: `http://${UI_HOSTNAME}:${UI_PORT}` }));
    // Allows the use of cookies in the application
    app.use((0, cookie_parser_1.default)());
    // Use the specified routes
    app.use("/", global_routes_1.default);
    app.use("/api", routes_1.default);
};
const connectToMongo = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongo_connection_1.default.connect();
});
const connectToRedis = () => __awaiter(void 0, void 0, void 0, function* () {
    yield redis_connection_1.default.connect();
});
const runServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        hookMiddleWare();
        connectToMongo();
        connectToRedis();
        app.listen(API_PORT, () => {
            console.log(`⚡️[server]: Server is running at http://${API_HOSTNAME}:${API_PORT}`);
        });
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
});
runServer();
