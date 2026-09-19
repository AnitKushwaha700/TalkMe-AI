import type { AIResponse } from "@/types";

/**
 * Parses a potentially incomplete or messy JSON string from the AI
 * into a structured AIResponse. Falls back gracefully.
 */
export function parseAIResponse(raw: string): AIResponse {
  const defaultResponse: AIResponse = {
    reply: "",
    grammarFixes: [],
    betterWords: [],
    pronunciationTip: "",
    confidenceScore: 50,
    cefrLevel: "B1",
    encouragement: "",
  };

  try {
    // Strip markdown code fences if present
    let cleaned = raw.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const parsed = JSON.parse(cleaned);

    return {
      reply: parsed.reply || defaultResponse.reply,
      grammarFixes: Array.isArray(parsed.grammarFixes)
        ? parsed.grammarFixes.map(
            (fix: Record<string, unknown>) => ({
              wrong: String(fix.wrong || ""),
              right: String(fix.right || ""),
              why: String(fix.why || ""),
              severity:
                fix.severity === "low" || fix.severity === "high"
                  ? fix.severity
                  : "medium",
            })
          )
        : [],
      betterWords: Array.isArray(parsed.betterWords)
        ? parsed.betterWords.map(
            (word: Record<string, unknown>) => ({
              youSaid: String(word.youSaid || ""),
              better: String(word.better || ""),
              example: String(word.example || ""),
            })
          )
        : [],
      pronunciationTip: parsed.pronunciationTip || "",
      confidenceScore:
        typeof parsed.confidenceScore === "number"
          ? Math.min(100, Math.max(0, parsed.confidenceScore))
          : 50,
      cefrLevel: parsed.cefrLevel || "B1",
      encouragement: parsed.encouragement || "",
    };
  } catch {
    // If JSON parsing fails, treat the raw text as the reply
    return {
      ...defaultResponse,
      reply: raw.trim() || "I didn't quite catch that. Could you say that again?",
    };
  }
}

/**
 * Extracts sentences from a text for sentence-by-sentence TTS.
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  // Split on sentence-ending punctuation followed by space or end
  const sentences = text.match(/[^.!?]+[.!?]+[\s]?|[^.!?]+$/g);
  return sentences ? sentences.map((s) => s.trim()).filter(Boolean) : [text];
}
