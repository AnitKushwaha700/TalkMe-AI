import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  minutesSpoken: number;
  newVocabulary: string[];
  averageGrammarScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true, default: Date.now },
    minutesSpoken: { type: Number, default: 0 },
    newVocabulary: [{ type: String }],
    averageGrammarScore: { type: Number, default: 100 },
  },
  { timestamps: true }
);

// Ensure only one progress record per user per day
ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

export const Progress: Model<IProgress> = 
  mongoose.models.Progress || mongoose.model<IProgress>('Progress', ProgressSchema);
