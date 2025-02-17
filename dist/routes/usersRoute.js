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
const router = express_1.default.Router();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// Get all users
router.get('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({});
        res.status(200).json({ success: true, users });
    }
    catch (error) {
        next(error);
    }
}));
// Get user by ID
router.get('/users/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        next(error);
    }
}));
// Update user by ID
router.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ success: false, message: 'Invalid user ID' });
            return;
        }
        const allowedUpdates = ['userName', 'email', 'role', 'userPhoto'];
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every((key) => allowedUpdates.includes(key));
        if (!isValidUpdate) {
            res.status(400).json({ success: false, message: 'Invalid fields in update request' });
            return;
        }
        const user = yield User_1.default.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
        if (!isValidEmail(req.body.email)) {
            res.status(400).json({ success: false, message: 'Invalid email format.' });
            return;
        }
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors
            });
            return;
        }
    }
}));
// Delete user by ID
router.delete('/users/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!mongoose_1.default.Types.ObjectId.isValid(req.params.id)) {
            res.status(400).json({ success: false, message: 'Invalid user ID' });
            return;
        }
        const user = yield User_1.default.findByIdAndDelete(req.params.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'User deleted successfully' });
    }
    catch (error) {
        next(error);
    }
}));
router.post('/loginAdmin', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: 'Please provide both email and password' });
            return;
        }
        const user = yield User_1.default.findOne({ email: email, role: 'admin' });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: 'Incorrect password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
        res.json({
            success: true,
            message: 'admin logged in successfully',
            token,
            user: {
                _id: user._id,
                userName: user.userName,
                email: user.email,
                role: user.role,
                userPhoto: user.userPhoto
            }
        });
    }
    catch (error) {
        next(error);
    }
}));
exports.default = router;
