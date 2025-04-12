import express, { Request, Response } from 'express';
import { PlaceModel, IPlace } from '../models/Place';

const router = express.Router();


router.get('/places', async (req: Request, res: Response) => {
    try {
        const places = await PlaceModel.find({});
        res.status(200).json({ success: true, data: places });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch places', error });
    }
});


router.get('/places/:id', async (req: Request, res: Response) => {
    try {
        const place = await PlaceModel.findById(req.params.id);
        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }
        res.status(200).json({ success: true, data: place });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch place', error });
    }
});

// Add a new place
router.post('/places', async (req: Request, res: Response) => {
    try {
        const newPlace = new PlaceModel(req.body);
        const savedPlace = await newPlace.save();
        res.status(201).json({ success: true, data: savedPlace });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add place', error });
    }
});

// Update a place by ID
router.put('/places/:id', async (req: Request, res: Response) => {
    try {
        const updatedPlace = await PlaceModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPlace) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }
        res.status(200).json({ success: true, data: updatedPlace });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update place', error });
    }
});

// Delete a place by ID
router.delete('/places/:id', async (req: Request, res: Response) => {
    try {
        const deletedPlace = await PlaceModel.findByIdAndDelete(req.params.id);
        if (!deletedPlace) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Place deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete place', error });
    }
});

// Add a review to a place
router.post('/places/:id/reviews', async (req: Request, res: Response) => {
    try {
        const { name, rating, text } = req.body;
        const place = await PlaceModel.findByIdAndUpdate(
            req.params.id,
            { $push: { reviews: { name, rating, text, relativePublishTimeDescription: new Date().toISOString() } } },
            { new: true }
        );
        if (!place) {
            res.status(404).json({ success: false, message: 'Place not found' });
            return;
        }
        res.status(201).json({ success: true, data: place });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add review', error });
    }
});

// Search nearby places
router.post('/places/nearby', async (req: Request, res: Response) => {
    try {
        const { includedTypes, maxResultCount, locationRestriction } = req.body;

        if (!locationRestriction || !locationRestriction.circle) {
             res.status(400).json({ success: false, message: 'Invalid location restriction' });
             return
        }

        const { center, radius } = locationRestriction.circle;

        if (!center || typeof center.latitude !== 'number' || typeof center.longitude !== 'number' || typeof radius !== 'number') {
             res.status(400).json({ success: false, message: 'Invalid center or radius' });
             return
        }

        const places = await PlaceModel.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[center.longitude, center.latitude], radius / 6378.1], // Convert radius to radians
                },
            },
            ...(includedTypes && includedTypes.length > 0 ? { types: { $in: includedTypes } } : {}),
        })
            .limit(maxResultCount || 20);

        if (places.length === 0) {
             res.status(404).json({ success: false, message: 'No nearby places found' });
             return
        }

        res.status(200).json({ success: true, data: places });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to search nearby places', error });
    }
});

export default router;

// Example place data
const examplePlace = {
    id: "unique-id-123",
    displayName: {
        text: "Pyramids of Giza",
        languageCode: "en"
    },
    location: {
        type: "Point",
        coordinates: [31.1342, 29.9792] // [longitude, latitude]
    },
    types: ["tourist_attraction"],
    rating: 4.8,
    userRatingCount: 5000,
    formattedAddress: "Giza, Egypt",
    websiteUri: "https://example.com",
    priceLevel: "moderate"
};