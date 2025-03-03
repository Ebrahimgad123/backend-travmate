import { Schema, model, Document, Types } from 'mongoose';

export interface ICar {
  _id: Types.ObjectId;
  model: string;
  carImage:string;
  yearMade: number;
  passengerNumber: number;
}
export interface IReview {
  _id: Types.ObjectId;
  name: string;
  image: string;
  comment: string;
  date: Date;
  rating: number;
}


export interface IGuide extends Document {
  name: string;
  price: number; 
  rating: number;
  guideType: string;
  languages: string[];
  image: string;
  description: string;
  availabilityDates: Date[];
  cities: string[];
  isAvailable: boolean;
  car?: ICar; 
  reviews ?: IReview[];
}
const CarSchema: Schema = new Schema({
 _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() },  
  model: { type: String, required: true },
  carImage: { type: String, required: true },
  yearMade: { type: Number, required: true },
  passengerNumber: { type: Number, required: true },
}, { _id: true });

const reviewSchema = new Schema<IReview>({
  _id: { type: Schema.Types.ObjectId, default: () => new Types.ObjectId() }, 
  name: { type: String, required: true },
  image: { type: String, required: true },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
  rating: { type: Number, required: true, min: 1, max: 5 },
}, { _id: true });


const guideSchema = new Schema<IGuide>({
  name: { type: String, required: true },
  price: { type: Number, required: true },  // تعديل السعر هنا
  rating: { type: Number, required: true, min: 0, max: 5 },
  guideType: { type: String, required: true },
  languages: { type: [String], required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  availabilityDates: { type: [Date], required: true },
  cities: { type: [String], required: true },
  isAvailable: { type: Boolean, default: true },
  car: { type: CarSchema, required: false },
  reviews: { type: [reviewSchema], default: [] },
}, { timestamps: true });


const Guide = model<IGuide>('TourGuide', guideSchema);

export default Guide;
