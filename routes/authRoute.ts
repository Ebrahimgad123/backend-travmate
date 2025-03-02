import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import jwt from 'jsonwebtoken';

const router = express.Router();

// const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
// const isValidUserName = (userName: string): boolean => userName.length >= 3 && /^[a-zA-Z0-9]+$/.test(userName);
const isValidPassword = (password: string): boolean => password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password);

router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, email, password, userPhoto } = req.body;
        if (!userName || !email || !password || !userPhoto) {
            res.status(400).json({ success: false, message: 'Please provide all fields' });
            return;
        }
        if( req.body.role) {
            res.status(403).json({ success: false, message: 'Access denied. Only admin can change role' });
            return;
        }
        // if (!isValidEmail(email)) {
        //     res.status(400).json({ success: false, message: 'Invalid email format.' });
        //     return;
        // }
        if (!isValidPassword(password)) {
            res.status(400).json({ success: false, message: 'Weak password. It must be at least 8 characters long, include a number, and an uppercase letter.' });
            return;
        }
        // if (!isValidUserName(userName)) {
        //     res.status(400).json({ success: false, message: 'Invalid username. It must be at least 3 characters long and contain only alphanumeric characters.' });
        //     return;
        // }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ userName, email, password: hashedPassword, userPhoto });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id,role:newUser.role }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: { id: newUser._id, name: newUser.userName, email: newUser.email, photo: newUser.userPhoto },
            token,
        });
    } catch (error) {
        next(error); 
    }
});

const sendError = (res: Response, status: number, message: string) => {
    return res.status(status).json({ success: false, message });
};

router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             sendError(res, 400, 'Please provide both email and password');
             return;
        }
        const user = await User.findOne({ email: email});
        if (!user) {
             sendError(res, 404, 'User not found');
             return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             sendError(res, 400, 'Incorrect password');
             return;
        }

        const token = jwt.sign({ userId: user._id ,role:user.role}, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });

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

    } catch (error) {
        next(error);
    }
});
export default router;
