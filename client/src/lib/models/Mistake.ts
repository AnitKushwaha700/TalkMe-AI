import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMistake extends Document {
  userId: mongoose.Types.ObjectId;
  conversationId: mongoose.Types.ObjectId;
  wrongText: string;
  correctedText: string;
  explanation: string;
  category: string; // e.g., 'grammar', 'vocabulary', 'pronunciation'
  createdAt: Date;
}

const MistakeSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true },
    wrongText: { type: String, required: true },
    correctedText: { type: String, required: true },
    explanation: { type: String, required: true },
    category: { type: String, default: 'grammar' },
  },
  { timestamps: true }
);

export const Mistake: Model<IMistake> = 
  mongoose.models.Mistake || mongoose.model<IMistake>('Mistake', MistakeSchema);
