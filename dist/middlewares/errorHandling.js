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
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFound = exports.errorHandling = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({
            success: false,
            message: "Invalid JSON format",
            error: err.message,
        });
        return;
    }
    next(err);
};
exports.errorHandler = errorHandler;
const notFound = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(404).json({ message: 'Page Not Found' });
});
exports.notFound = notFound;
const errorHandling = (err, req, res) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
    return;
};
exports.errorHandling = errorHandling;
