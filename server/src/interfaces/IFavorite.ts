import { Document } from "mongoose";

export default interface IFavorite extends Document {
  _id: string;
  user_uuid: string;
  book_uuid: string;
}
