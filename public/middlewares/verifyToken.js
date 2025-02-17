"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokens = verifyTokens;
exports.verifyTokensAndAuthorization = verifyTokensAndAuthorization;
exports.verifyTokensAndAdmin = verifyTokensAndAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || ".sZz=x9OfY`2o4X";
function verifyTokens(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userData = decoded;
        next();
    }
    catch (error) {
        next(error);
        return;
    }
}
// المستخدم العادي: يمكنه فقط تعديل أو الوصول إلى معلوماته الشخصية.
function verifyTokensAndAuthorization(req, res, next) {
    verifyTokens(req, res, () => {
        var _a, _b;
        if (((_a = req.userData) === null || _a === void 0 ? void 0 : _a._id) === req.params.id || ((_b = req.userData) === null || _b === void 0 ? void 0 : _b.role) === "admin") {
            return next();
        }
        else {
            return res.status(403).json({
                message: "You are not allowed to update this user, you can only update your account",
            });
        }
    });
}
// المشرف (Admin): يمكنه الوصول إلى معلومات جميع المستخدمين وتعديلها.
function verifyTokensAndAdmin(req, res, next) {
    verifyTokens(req, res, () => {
        var _a;
        if (((_a = req.userData) === null || _a === void 0 ? void 0 : _a.role) === "admin") {
            return next();
        }
        else {
            console.log(req.userData);
            return res.status(403).json({ message: "You are not allowed, only admin is allowed" });
        }
    });
}
