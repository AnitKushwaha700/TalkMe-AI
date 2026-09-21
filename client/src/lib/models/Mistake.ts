import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMistake extends Document {
  sessionId: string;
  type: "grammar" | "vocabulary" | "pronunciation";
  wrong: string;
  right: string;
  why: string;
  occurrences: number;
  lastSeen: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MistakeSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ["grammar", "vocabulary", "pronunciation"],
      default: "grammar",
    },
    wrong: { type: String, required: true },
    right: { type: String, required: true },
    why: { type: String, required: true },
    occurrences: { type: Number, default: 1 },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for deduplication
MistakeSchema.index({ sessionId: 1, wrong: 1, right: 1 }, { unique: true });

export const Mistake: Model<IMistake> =
  mongoose.models.Mistake ||
  mongoose.model<IMistake>("Mistake", MistakeSchema);
