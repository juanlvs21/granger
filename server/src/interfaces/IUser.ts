import { Document } from "mongoose";

// Interface
import IBook from "./IBook";

export default interface IUser extends Document {
  _id: string;
  uuid: string;
  customer_id: string;
  email: string;
  password: string | string;
  firstName: string;
  lastName: string;
  admin: boolean;
  created_date: string;
  encryptPassword(password: string): Promise<string>;
  validatePassword(password: string): Promise<boolean>;
}
