// ─── AI Response Schema ───────────────────────────────────────────
export interface GrammarFix {
  wrong: string;
  right: string;
  why: string;
  severity: "low" | "medium" | "high";
}

export interface BetterWord {
  youSaid: string;
  better: string;
  example: string;
}

export interface AIResponse {
  reply: string;
  grammarFixes: GrammarFix[];
  betterWords: BetterWord[];
  pronunciationTip: string;
  confidenceScore: number;
  cefrLevel: CEFRLevel;
  encouragement: string;
}

// ─── CEFR Levels ──────────────────────────────────────────────────
export type CEFRLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

// ─── Messages ─────────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  text: string;
  timestamp: Date;
  analysis?: {
    grammarFixes: GrammarFix[];
    betterWords: BetterWord[];
    confidenceScore: number;
    cefrLevel: CEFRLevel;
    pronunciationTip?: string;
    encouragement?: string;
  };
}

// ─── Practice Modes ───────────────────────────────────────────────
export type PracticeModeSlug =
  | "free-talk"
  | "interview"
  | "restaurant"
  | "airport"
  | "office"
  | "college"
  | "shopping"
  | "debate";

export interface PracticeMode {
  slug: PracticeModeSlug;
  title: string;
  description: string;
  aiPersona: string;
  openingPrompt: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  gradient: string; // tailwind gradient
}

// ─── Voice ────────────────────────────────────────────────────────
export type VoiceState =
  | "idle"
  | "listening"
  | "processing"
  | "speaking"
  | "error";

export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
  confidence: number;
}

// ─── Session ──────────────────────────────────────────────────────
export interface UserSession {
  sessionId: string;
  level: CEFRLevel;
  streak: number;
  totalMinutes: number;
  xp: number;
  lastActiveAt: Date;
  createdAt: Date;
}

// ─── Progress ─────────────────────────────────────────────────────
export interface DailyProgress {
  date: string;
  minutes: number;
  messages: number;
  grammarScore: number;
  newWords: number;
  streakMaintained: boolean;
}

// ─── Conversation ─────────────────────────────────────────────────
export interface ConversationSummary {
  id: string;
  mode: PracticeModeSlug;
  startedAt: Date;
  duration: number;
  messageCount: number;
  avgConfidence: number;
}

// ─── API Types ────────────────────────────────────────────────────
export interface ChatRequest {
  message: string;
  mode: PracticeModeSlug;
  conversationId?: string;
  history: Array<{ role: "user" | "ai"; text: string }>;
}

export interface StreamChunk {
  type: "text" | "analysis" | "error" | "done";
  content: string;
}
