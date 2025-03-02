import express, { Request, Response, NextFunction } from 'express';
import Place from '../models/Place';

const router = express.Router();


router.post('/places', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, description, location, address, images, category } = req.body;

        if (!name || !description || !location || !address || !category) {
            res.status(400).json({ success: false, message: 'Please provide all required fields' });
            return;
        }

        const newPlace = new Place({ name, description, location, address, images, category });

        await newPlace.save();
        res.status(201).json({ success: true, message: 'Place added successfully', place: newPlace });
    } catch (error) {
        next(error);
    }
});


router.get('/places', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const places = await Place.find();
        res.json({ success: true, places });
    } catch (error) {
        next(error);
    }
});


router.get('/places/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }

        res.json({ success: true, place });
    } catch (error) {
        next(error);
    }
});


router.put('/places/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }
        const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json({ success: true, message: 'Place updated successfully', place: updatedPlace });
    } catch (error) {
        next(error);
    }
});


router.delete('/places/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }

        await place.deleteOne();
        res.json({ success: true, message: 'Place deleted successfully' });
    } catch (error) {
        next(error);
    }
});


router.post('/places/:id/reviews', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { comment, rating } = req.body;

        if (!comment || rating == null || rating < 0 || rating > 5) {
            res.status(400).json({ success: false, message: 'Invalid review data' });
            return;
        }

        const place = await Place.findById(req.params.id);

        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }

        // تأكد أن reviews ليست undefined
        if (!place.reviews) place.reviews = [];

        // إضافة التقييم
        place.reviews.push( comment, rating );

        // حساب التقييم العام
        const totalRatings = place.reviews.reduce((acc, review) => acc + review.rating, 0);
        place.rating = totalRatings / place.reviews.length;

        await place.save();
        res.status(201).json({ success: true, message: 'Review added successfully', place });
    } catch (error) {
        next(error);
    }
});

export default router;
