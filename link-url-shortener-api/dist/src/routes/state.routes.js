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
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const cache_keys_1 = require("../util/cache-keys");
// import moment from "moment";
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { anonUserUUID } = req.cookies;
    if (!!!anonUserUUID) {
        // no cookie: set a new cookie
        let cookie = (0, uuid_1.v4)();
        res.cookie(cache_keys_1.CacheKeysEnum.ANON_USER, cookie, {
        // Commenting out for now
        //   maxAge: moment().add(1, "year").unix(),
        });
        // no: cookie not present, return this state
        return res.status(http_status_codes_1.default.OK).json({ user: [cookie] });
    }
    else {
        // yes: cookie was already present, return this state
        return res.status(http_status_codes_1.default.OK).json({ user: [anonUserUUID] });
    }
}));
module.exports = router;
