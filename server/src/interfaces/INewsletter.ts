import { Document } from "mongoose";

export default interface INewsletter extends Document {
  user_uuid: string;
  email: string;
  subscription_date: string;
}
