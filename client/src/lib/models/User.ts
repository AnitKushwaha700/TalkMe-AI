import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  sessionId: string;
  email?: string;
  name?: string;
  image?: string;
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  streak: number;
  totalMinutes: number;
  xp: number;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    email: { type: String, sparse: true },
    name: { type: String },
    image: { type: String },
    level: {
      type: String,
      enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
      default: "A1",
    },
    streak: { type: Number, default: 0 },
    totalMinutes: { type: Number, default: 0 },
    xp: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
