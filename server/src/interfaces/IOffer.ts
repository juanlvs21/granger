import { Document } from "mongoose";

export default interface IOffer extends Document {
  book_uuid: string;
  percentage: number;
  newPrice: number;
  firstDay: string;
  lastDay: string;
}
