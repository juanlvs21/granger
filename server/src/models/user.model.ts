import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";

// Interface
import { IBook } from "./book.model";

export interface IUser extends Document {
  _id: string;
  uuid: string;
  email: string;
  password: string | string;
  firstName: string;
  lastName: string;
  admin: boolean;
  favorites?: [IBook];
  created_date: string;
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: string): Promise<boolean>;
}

// Schema
const userSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, min: 8 },
  password: { type: String, required: true, min: 6 },
  firstName: { type: String },
  lastName: { type: String },
  admin: { type: Boolean, required: true, default: false },
  favorites: { type: [{}], default: [] },
  created_date: {
    type: String,
    required: true,
    default: moment().toISOString()
  }
});

// Methods
userSchema.methods.encryptPassword = async (
  password: string
): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function(
  password: string
): Promise<boolean> {
  // Function is used instead of arrow function to make use of this and use userSchema information
  return await bcrypt.compare(password, this.password);
};

export default model<IUser>("User", userSchema);
