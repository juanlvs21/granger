import { Schema, model } from "mongoose";
import moment from "moment";

// Inteface
import IBook from "../interfaces/IBook";

// Schema
const bookSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  authors: { type: String },
  yearPublication: { type: Number },
  genre: { type: [String] },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  stars: { type: Number, required: false, default: 0 },
  uploadedBy: { type: {}, required: true },
  created_date: {
    type: String,
    required: true,
    default: moment().toISOString()
  },
  folder: { type: String, required: true },
  cover: { type: String, required: true },
  pdf: { type: String, required: true }
});

export default model<IBook>("Book", bookSchema);
