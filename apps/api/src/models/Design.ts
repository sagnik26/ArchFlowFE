import mongoose, { Schema, model } from "mongoose";

export type DesignType = "hld" | "db" | "lld" | "design_studio";

export interface IDesign {
  _id: mongoose.Types.ObjectId;
  type: DesignType;
  userId: mongoose.Types.ObjectId;
  payload: unknown;
  prompt?: string;
  createdAt: Date;
  updatedAt: Date;
}

const designSchema = new Schema<IDesign>(
  {
    type: { type: String, required: true, enum: ["hld", "db", "lld", "design_studio"] },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    payload: { type: Schema.Types.Mixed, required: true },
    prompt: { type: String },
  },
  { timestamps: true }
);

designSchema.index({ userId: 1, createdAt: -1 });

export const Design = model<IDesign>("Design", designSchema);
