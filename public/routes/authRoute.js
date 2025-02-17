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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidUserName = (userName) => userName.length >= 3 && /^[a-zA-Z0-9]+$/.test(userName);
const isValidPassword = (password) => password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password, userPhoto } = req.body;
        if (!userName || !email || !password || !userPhoto) {
            res.status(400).json({ success: false, message: 'Please provide all fields' });
            return;
        }
        if (req.body.role) {
            res.status(403).json({ success: false, message: 'Access denied. Only admin can change role' });
            return;
        }
        if (!isValidEmail(email)) {
            res.status(400).json({ success: false, message: 'Invalid email format.' });
            return;
        }
        if (!isValidPassword(password)) {
            res.status(400).json({ success: false, message: 'Weak password. It must be at least 8 characters long, include a number, and an uppercase letter.' });
            return;
        }
        if (!isValidUserName(userName)) {
            res.status(400).json({ success: false, message: 'Invalid username. It must be at least 3 characters long and contain only alphanumeric characters.' });
            return;
        }
        const existingUser = yield User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = new User_1.default({ userName, email, password: hashedPassword, userPhoto });
        yield newUser.save();
        const token = jsonwebtoken_1.default.sign({ userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: newUser._id, name: newUser.userName, email: newUser.email, photo: newUser.userPhoto },
            token,
        });
    }
    catch (error) {
        next(error);
    }
}));
// دالة لإرسال الأخطاء
const sendError = (res, status, message) => {
    return res.status(status).json({ success: false, message });
};
router.post('/login', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            sendError(res, 400, 'Please provide both email and password');
            return;
        }
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            sendError(res, 404, 'User not found');
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            sendError(res, 400, 'Incorrect password');
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
        res.json({
            success: true,
            message: 'User logged in successfully',
            user: {
                id: user._id,
                name: user.userName,
                email: user.email,
                photo: user.userPhoto
            },
            token
        });
        return;
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
