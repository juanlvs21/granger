import { Schema, model } from "mongoose";

// Inteface
import IFavorite from "../interfaces/IFavorite";

// Schema
const favoriteSchema = new Schema({
  user_uuid: { type: String, required: true },
  book_uuid: { type: String, required: true },
  book: { type: {}, required: true }
});

export default model<IFavorite>("Favorite", favoriteSchema);
