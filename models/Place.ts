import mongoose, { Schema, Document } from 'mongoose';

interface IPlace extends Document {
    name: string;
    description: string;
    location: {
        type: string;
        coordinates: number[]; 
    };
    address: string;
    images: string[];
    category: string;
    rating: number;
    reviews: { user: mongoose.Schema.Types.ObjectId; comment: string; rating: number }[];
    createdBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}


const PlaceSchema: Schema = new Schema<IPlace>({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], required: true }, 
    },
    address: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    category: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
            comment: { type: String, required: true },
            rating: { type: Number, required: true, min: 0, max: 5 },
        },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});


PlaceSchema.index({ location: '2dsphere' });

const Place = mongoose.model<IPlace>('Place', PlaceSchema);

export default Place;
