import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IConversation extends Document {
  userId: mongoose.Types.ObjectId;
  mode: string; // e.g., 'job_interview', 'casual'
  transcript: {
    speaker: 'user' | 'ai';
    text: string;
    timestamp: Date;
    grammarScore?: number;
    corrections?: string[];
  }[];
  durationSeconds: number;
  overallScore: number;
  createdAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    mode: { type: String, required: true },
    transcript: [
      {
        speaker: { type: String, enum: ['user', 'ai'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        grammarScore: { type: Number },
        corrections: [{ type: String }],
      },
    ],
    durationSeconds: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Conversation: Model<IConversation> = 
  mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);
