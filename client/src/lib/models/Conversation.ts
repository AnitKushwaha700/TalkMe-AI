import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "ai";
  text: string;
  audioDuration?: number;
  analysis?: {
    grammarFixes: Array<{
      wrong: string;
      right: string;
      why: string;
      severity: "low" | "medium" | "high";
    }>;
    betterWords: Array<{
      youSaid: string;
      better: string;
      example: string;
    }>;
    confidenceScore: number;
    cefrLevel: string;
    pronunciationTip?: string;
    encouragement?: string;
  };
  createdAt: Date;
}

export interface IConversation extends Document {
  sessionId: string;
  mode: string;
  messages: IMessage[];
  startedAt: Date;
  endedAt?: Date;
  duration: number;
  messageCount: number;
  avgConfidence: number;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSubSchema = new Schema(
  {
    role: { type: String, enum: ["user", "ai"], required: true },
    text: { type: String, required: true },
    audioDuration: { type: Number },
    analysis: {
      grammarFixes: [
        {
          wrong: String,
          right: String,
          why: String,
          severity: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
          },
        },
      ],
      betterWords: [
        {
          youSaid: String,
          better: String,
          example: String,
        },
      ],
      confidenceScore: Number,
      cefrLevel: String,
      pronunciationTip: String,
      encouragement: String,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const ConversationSchema: Schema = new Schema(
  {
    sessionId: { type: String, required: true, index: true },
    mode: { type: String, required: true },
    messages: [MessageSubSchema],
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date },
    duration: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 },
    avgConfidence: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Conversation: Model<IConversation> =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
