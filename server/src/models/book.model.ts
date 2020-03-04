import { Schema, model } from "mongoose";

// Inteface
import IBook from "../interfaces/IBook";

// Schema
const bookSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  wordsTitle: { type: [String], required: true }, // It is used for search
  slug: { type: String, unique: true, required: true },
  description: { type: String, required: false },
  authors: { type: String },
  yearPublication: { type: Number, default: 0 },
  genre: { type: [String] },
  price: { type: Number, required: true },
  stars: { type: Number, required: false, default: 0 },
  scores: { type: [{}], required: false, default: [] },
  uploadedBy: { type: String, required: true },
  created_date: { type: String, required: true },
  cover: { type: String, required: true },
  pdf: { type: String, required: true }
});

export default model<IBook>("Book", bookSchema);
