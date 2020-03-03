import { Schema, model } from "mongoose";

// Inteface
import IOffer from "../interfaces/IOffer";

// Schema
const offerSchema = new Schema({
  book_uuid: { type: String, required: true },
  percentage: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  firstDay: { type: String },
  lastDay: { type: String }
});

export default model<IOffer>("Offer", offerSchema);
