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
const express_1 = __importDefault(require("express"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const moment_1 = __importDefault(require("moment"));
const mappings_models_1 = __importDefault(require("../models/mappings.models"));
const General = __importStar(require("../util/general"));
const app = (0, express_1.default)();
const { UI_PORT, UI_HOSTNAME } = General.setEnvironmentVariables();
app.get("/ping", (req, res) => res.status(http_status_codes_1.default.OK).send("PONG"));
// catch favicon.ico as it passes to /:shortURL
app.get("/favicon.ico", (req, res) => res.status(http_status_codes_1.default.NO_CONTENT));
app.get("/:shortURL", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundMapping = yield mappings_models_1.default.findOne({
        alias: req.params.shortURL,
    });
    if (foundMapping) {
        //check expiration date
        const currentTimeNow = (0, moment_1.default)().unix();
        if (currentTimeNow > foundMapping.expiration) {
            //Expired
            yield mappings_models_1.default.deleteOne({
                alias: req.params.shortURL,
            });
        }
        // If without http://, append it
        if (!foundMapping.originalURL.includes("://") &&
            !foundMapping.originalURL.startsWith("/")) {
            res
                .status(http_status_codes_1.default.PERMANENT_REDIRECT)
                .redirect("http://" + foundMapping.originalURL);
        }
        else {
            res
                .status(http_status_codes_1.default.PERMANENT_REDIRECT)
                .redirect(foundMapping.originalURL);
        }
    }
    else {
        // Couldn't find mapping, redirect
        res
            .status(http_status_codes_1.default.PERMANENT_REDIRECT)
            .redirect(`http://${UI_HOSTNAME}:${UI_PORT}`);
    }
}));
exports.default = app;
