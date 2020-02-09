import { Document } from "mongoose";

export default interface IGenre extends Document {
  _id: string;
  genre: string;
}
