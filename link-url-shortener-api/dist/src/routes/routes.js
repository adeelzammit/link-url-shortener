"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const shorten = require("./shorten.routes");
const urls = require("./urls.routes");
const state = require("./state.routes");
const app = (0, express_1.default)();
app.use("/shorten", shorten);
app.use("/urls", urls);
app.use("/state", state);
exports.default = app;
