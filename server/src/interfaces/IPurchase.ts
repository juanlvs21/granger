import { Document } from "mongoose";

export default interface IPurchase extends Document {
  uuid: string;
  user_uuid: string;
  user_email: string;
  book_uuid: string;
  payments_id: number;
  book: {};
  date_purchase: string;
}
