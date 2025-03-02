import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import mongoose from 'mongoose';
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


// Get all users
router.get('/users', async (req, res, next) => {
    try {
        const users = await User.find({}); 
        res.status(200).json({ success: true, users }); 
    } catch (error) {
        next(error);
    }
});
// Get user by ID
router.get('/users/:id', async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return;
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
});

// Update user by ID

router.put('/users/:id', async (req, res, ) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             res.status(400).json({ success: false, message: 'Invalid user ID' });
             return
        }

        const allowedUpdates = ['userName', 'email','role','userPhoto'];
        const updates = Object.keys(req.body);
        const isValidUpdate = updates.every((key) => allowedUpdates.includes(key));

        if (!isValidUpdate) {
             res.status(400).json({ success: false, message: 'Invalid fields in update request' });
             return;
        }
        

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        );
        if (!isValidEmail(req.body.email)) {
            res.status(400).json({ success: false, message: 'Invalid email format.' });
            return;
        }

        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return;
        }


        res.status(200).json({ success: true, user });
    } catch (error) {

        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors
            });
            return;
        }
     
    }
});

// Delete user by ID

router.delete('/users/:id', async (req, res, next) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
             res.status(400).json({ success: false, message: 'Invalid user ID' });
             return
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return;
        }

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        next(error);
    }
});
router.post('/loginAdmin', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email ||!password) {
             res.status(400).json({ success: false, message: 'Please provide both email and password' });
             return;
        }   
        const user = await User.findOne({ email: email, role: 'admin' });
        if (!user) {
             res.status(404).json({ success: false, message: 'User not found' });
             return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
             res.status(400).json({ success: false, message: 'Incorrect password' });
             return;
        }
        const token = jwt.sign({ userId: user._id,role:user.role }, process.env.JWT_SECRET || 'defaultSecret', { expiresIn: '1h' });
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
        
    } catch (error) {
        next(error);
    }

}
)


export default router;
