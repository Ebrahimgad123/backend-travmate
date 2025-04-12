import mongoose, { Schema, Document } from 'mongoose';

export interface IPlace extends Document {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  types: string[];
  rating: number;
  userRatingCount: number;
  formattedAddress: string;
  websiteUri: string;
  priceLevel: string;
  photos: string[]; // Array of photo URLs
}

const PlaceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  displayName: {
    text: { type: String, required: true },
    languageCode: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  types: { type: [String], required: true },
  rating: { type: Number, required: true },
  userRatingCount: { type: Number, required: true },
  formattedAddress: { type: String, required: true },
  websiteUri: { type: String, required: true },
  priceLevel: { type: String, required: true },
  photos: { type: [String], default: [] }, // New attribute for photo URLs
});

// Add geospatial index
PlaceSchema.index({ location: '2dsphere' });

export const PlaceModel = mongoose.model<IPlace>('Place', PlaceSchema);


