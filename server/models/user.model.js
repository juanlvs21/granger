import { Schema, Document, model, models } from "mongoose";
import bcrypt from "bcrypt";
import moment from "moment";

// Schema
const userSchema = new Schema({
  uuid: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true, min: 8 },
  password: { type: String, required: true, min: 6 },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  admin: { type: Boolean, required: true, default: false },
  favorites: { type: [{}], default: [] },
  created_date: {
    type: String,
    required: true,
    default: moment().toISOString()
  }
});

// Methods
userSchema.methods.encryptPassword = async password => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async (loginPassword, userPassword) => {
  // Function is used instead of arrow function to make use of this and use userSchema information
  return await bcrypt.compare(loginPassword, userPassword);
};

export default models.User || model("User", userSchema);
