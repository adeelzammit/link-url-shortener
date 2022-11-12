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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const General = __importStar(require("../../src/util/general"));
const { Schema } = mongoose_1.default;
// Getting relevant ports for UI
const { API_PORT, API_HOSTNAME } = General.setEnvironmentVariables();
// Changes the response before sending out to the client
const generateMappingSchemaOptions = () => {
    return {
        versionKey: false,
        transform: (doc, ret) => {
            ret.id = ret._id;
            ret.alias = `http://${API_HOSTNAME}:${API_PORT}/` + ret.alias;
            delete ret.userID;
            delete ret._id;
            return ret;
        },
    };
};
const options = {
    toJSON: Object.assign({}, generateMappingSchemaOptions()),
    toObject: Object.assign({}, generateMappingSchemaOptions()),
};
const MappingSchema = new Schema({
    alias: {
        type: Schema.Types.String,
        required: false,
        default: null,
        minLength: 5,
    },
    userID: {
        type: Schema.Types.Mixed,
        required: false,
        default: null,
    },
    originalURL: {
        type: Schema.Types.String,
        required: true,
    },
    expiration: {
        type: Schema.Types.Number,
        required: false,
        default: null,
    },
}, options);
const Mapping = mongoose_1.default.model("mappings", MappingSchema);
exports.default = Mapping;
