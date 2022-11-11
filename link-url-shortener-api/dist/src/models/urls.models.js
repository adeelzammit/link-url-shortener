"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongodb_1 = require("mongodb");
const UrlSchema = new mongoose.Schema({
    alias: {
        type: String,
        required: true,
    },
    userID: {
        type: mongodb_1.ObjectId,
        required: true,
    },
    originalURL: {
        type: String,
        required: true,
    },
    expiration: {
        type: mongodb_1.Timestamp,
        required: false,
    },
});
const Url = mongoose.model("users", UrlSchema);
module.exports = { Url };
