import { Schema, model } from "mongoose";

// Inteface
import IPurchase from "../interfaces/IPurchase";

// Schema
const purchaseSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  user_uuid: { type: String, required: true },
  user_email: { type: String, required: true },
  book_uuid: { type: String, required: true },
  payments_id: { type: String, required: true },
  book: { type: {}, required: true },
  date_purchase: { type: String, required: true }
});

export default model<IPurchase>("Purchase", purchaseSchema);
