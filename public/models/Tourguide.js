"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CarSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: () => new mongoose_1.Types.ObjectId() },
    model: { type: String, required: true },
    yearMade: { type: Number, required: true },
    passengerNumber: { type: Number, required: true },
}, { _id: true });
const reviewSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, default: () => new mongoose_1.Types.ObjectId() },
    name: { type: String, required: true },
    image: { type: String, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now },
    rating: { type: Number, required: true, min: 1, max: 5 },
}, { _id: true });
const guideSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true }, // تعديل السعر هنا
    rating: { type: Number, required: true, min: 0, max: 5 },
    guideType: { type: String, required: true },
    languages: { type: [String], required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    availabilityDates: { type: [Date], required: true },
    cities: { type: [String], required: true },
    isAvailable: { type: Boolean, default: true },
    car: { type: CarSchema, required: false },
    reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });
const Guide = (0, mongoose_1.model)('TourGuide', guideSchema);
exports.default = Guide;
