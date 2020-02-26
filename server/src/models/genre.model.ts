import { Schema, model } from "mongoose";

// Inteface
import IGenre from "../interfaces/IGenre";

// Schema
const genreSchema = new Schema({
  genre: { type: String, unique: true, required: true }
});

export default model<IGenre>("Genre", genreSchema);
