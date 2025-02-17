"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/TypescriptApp";
function connectToMongoDB() {
    mongoose_1.default
        .connect(uri)
        .then(() => {
        console.log("Connected to MongoDB");
    })
        .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });
}
exports.default = connectToMongoDB;
