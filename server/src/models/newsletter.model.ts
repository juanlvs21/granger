import { Schema, model } from "mongoose";

// Inteface
import INewsletter from "../interfaces/INewsletter";

// Schema
const newsletterSchema = new Schema({
  user_uuid: { type: String, required: true },
  email: { type: String, required: true },
  subscription_date: { type: String, required: true }
});

export default model<INewsletter>("Newsletter", newsletterSchema);
