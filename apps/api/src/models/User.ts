import mongoose, { Schema, model } from "mongoose";

export interface IUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
