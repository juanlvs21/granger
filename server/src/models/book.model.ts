import { Schema, model } from "mongoose";
import moment from "moment";

// Inteface
import IBook from "../interfaces/IBook";

// Schema
const bookSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: false },
  authors: { type: String },
  yearPublication: { type: Number },
  genre: { type: [String] },
  available: { type: Boolean, required: true, default: true },
  price: { type: Number, required: true },
  stars: { type: Number, required: false, default: 0 },
  uploadedBy: { type: {}, required: true },
  created_date: {
    type: String,
    required: true,
    default: moment().toISOString()
  },
  cover: { type: String, required: true },
  pdf: { type: String, required: true }
});

export default model<IBook>("Book", bookSchema);
