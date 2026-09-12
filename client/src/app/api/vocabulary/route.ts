import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { Conversation } from "@/lib/models/Conversation";

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ words: [] });
    }

    await connectToDatabase();

    // Aggregate all betterWords suggestions from all conversations
    const conversations = await Conversation.find({ sessionId })
      .select({ "messages.analysis.betterWords": 1 })
      .lean();

    const wordMap = new Map<
      string,
      { youSaid: string; better: string; example: string; count: number }
    >();

    for (const conv of conversations) {
      if (!conv.messages) continue;
      for (const msg of conv.messages) {
        if (!msg.analysis?.betterWords) continue;
        for (const word of msg.analysis.betterWords) {
          const key = `${word.youSaid}::${word.better}`;
          const existing = wordMap.get(key);
          if (existing) {
            existing.count++;
          } else {
            wordMap.set(key, {
              youSaid: word.youSaid,
              better: word.better,
              example: word.example,
              count: 1,
            });
          }
        }
      }
    }

    const words = Array.from(wordMap.values()).sort(
      (a, b) => b.count - a.count
    );

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Vocabulary API error:", error);
    return NextResponse.json(
      { error: "Failed to get vocabulary data" },
      { status: 500 }
    );
  }
}
