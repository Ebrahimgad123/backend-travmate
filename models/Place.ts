import mongoose, { Document, Schema, model } from "mongoose";

export interface IPlace extends Document {
  id: string;
  displayName: {
    text: string;
    languageCode: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  types: string[];
  rating: number;
  userRatingCount: number;
  photos: {
    name: string;
    widthPx: number;
    heightPx: number;
  }[];
  formattedAddress: string;
  websiteUri: string;
  regularOpeningHours: {
    periods: {
      open: {
        day: number;
        hour: number;
        minute: number;
      };
      close: {
        day: number;
        hour: number;
        minute: number;
      };
    }[];
    weekdayDescriptions: string[];
  };
  editorialSummary: {
    text: string;
    languageCode: string;
  };
  priceLevel: string;
  reviews: {
    name: string;
    rating: number;
    text: {
      text: string;
      languageCode: string;
    };
    relativePublishTimeDescription: string;
  }[];
}

// 2. MongoDB Schema
const PlaceSchema: Schema = new Schema({
  id: { type: String, required: true, unique: true },
  displayName: {
    text: { type: String, required: true },
    languageCode: { type: String, required: true },
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }, // [longitude, latitude]
  },
  types: [{ type: String }],
  rating: { type: Number },
  userRatingCount: { type: Number },
  photos: [
    {
      name: String,
      widthPx: Number,
      heightPx: Number,
    },
  ],
  formattedAddress: { type: String },
  websiteUri: { type: String },
  regularOpeningHours: {
    periods: [
      {
        open: {
          day: Number,
          hour: Number,
          minute: Number,
        },
        close: {
          day: Number,
          hour: Number,
          minute: Number,
        },
      },
    ],
    weekdayDescriptions: [String],
  },
  editorialSummary: {
    text: String,
    languageCode: String,
  },
  priceLevel: { type: String },
  reviews: [
    {
      name: String,
      rating: Number,
      text: {
        text: String,
        languageCode: String,
      },
      relativePublishTimeDescription: String,
    },
  ],
});

// Add geospatial index
PlaceSchema.index({ location: '2dsphere' });

export const PlaceModel = model<IPlace>("Place", PlaceSchema);


