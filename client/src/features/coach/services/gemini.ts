import { GoogleGenAI } from "@google/genai";
import { getSystemPrompt } from "@/features/coach/prompts/system";
import type { PracticeMode } from "@/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is not set. AI features will not work."
  );
}

let ai: GoogleGenAI | null = null;

function getAI(): GoogleGenAI {
  if (!ai) {
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }
    ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }
  return ai;
}

interface ChatHistoryEntry {
  role: "user" | "ai";
  text: string;
}

/**
 * Generate a streaming response from Gemini.
 * Returns an async iterable of text chunks.
 */
export async function* generateChatResponseStream(
  mode: PracticeMode,
  userMessage: string,
  history: ChatHistoryEntry[]
): AsyncGenerator<string> {
  const client = getAI();
  const systemPrompt = getSystemPrompt(mode);

  // Build conversation context
  const conversationContext = history
    .slice(-10) // Keep last 10 messages for context
    .map((msg) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.text}`)
    .join("\n");

  const fullPrompt = conversationContext
    ? `${conversationContext}\nUser: ${userMessage}`
    : `User: ${userMessage}`;

  const response = await client.models.generateContentStream({
    model: "gemini-2.0-flash",
    contents: fullPrompt,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 1024,
      temperature: 0.8,
      topP: 0.95,
    },
  });

  for await (const chunk of response) {
    const text = chunk.text;
    if (text) {
      yield text;
    }
  }
}

/**
 * Generate a non-streaming response from Gemini (for simpler use cases).
 */
export async function generateChatResponse(
  mode: PracticeMode,
  userMessage: string,
  history: ChatHistoryEntry[]
): Promise<string> {
  const client = getAI();
  const systemPrompt = getSystemPrompt(mode);

  const conversationContext = history
    .slice(-10)
    .map((msg) => `${msg.role === "user" ? "User" : "Coach"}: ${msg.text}`)
    .join("\n");

  const fullPrompt = conversationContext
    ? `${conversationContext}\nUser: ${userMessage}`
    : `User: ${userMessage}`;

  const response = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: fullPrompt,
    config: {
      systemInstruction: systemPrompt,
      maxOutputTokens: 1024,
      temperature: 0.8,
      topP: 0.95,
    },
  });

  return response.text ?? "";
}
