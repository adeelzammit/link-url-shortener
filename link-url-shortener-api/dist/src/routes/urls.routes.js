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
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const mappings_models_1 = __importDefault(require("../models/mappings.models"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const router = express_1.default.Router();
router.use(body_parser_1.default.urlencoded({ extended: false }));
router.use(body_parser_1.default.json());
// Get historical mappings related to the user
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { anonUserUUID } = req.cookies;
    const historicalMappings = yield mappings_models_1.default.find({
        userID: { $eq: anonUserUUID },
    });
    return res.status(http_status_codes_1.default.OK).json(historicalMappings);
}));
// Don't delete the records themselves but just delete userID reference's to the mappings
router.delete("/history", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { anonUserUUID } = req.cookies;
    const deletedMappings = yield mappings_models_1.default.updateMany({
        userID: { $eq: anonUserUUID },
    }, { userID: null });
    return res.status(http_status_codes_1.default.NO_CONTENT).json(deletedMappings);
}));
module.exports = router;
