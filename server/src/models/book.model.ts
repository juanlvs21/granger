import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

// Interfaces
import { IUser } from "./user.model";

export interface IBook extends Document {
  _id: string;
  uuid: string;
  title: string;
  authors?: [string];
  editorial?: string;
  yearPublication?: number;
  genre?: [string];
  price: number;
  quantity: number;
  uploadedBy: IUser;
  created_date: string;
}

// Schema
const bookSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  authors: { type: [String] },
  yearPublication: { type: Number },
  genre: { type: [String] },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  uploadedBy: { type: Map, required: true },
  created_date: { type: String, required: true }
});

export default model<IBook>("Book", bookSchema);
