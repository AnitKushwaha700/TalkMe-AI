import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProgress extends Document {
  sessionId: string;
  date: string; // YYYY-MM-DD
  minutes: number;
  messages: number;
  grammarScore: number;
  newWords: number;
  streakMaintained: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    minutes: { type: Number, default: 0 },
    messages: { type: Number, default: 0 },
    grammarScore: { type: Number, default: 0 },
    newWords: { type: Number, default: 0 },
    streakMaintained: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// One progress record per user per day
ProgressSchema.index({ sessionId: 1, date: 1 }, { unique: true });

export const Progress: Model<IProgress> =
  mongoose.models.Progress ||
  mongoose.model<IProgress>("Progress", ProgressSchema);
