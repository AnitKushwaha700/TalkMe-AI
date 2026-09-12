import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { Conversation } from "@/lib/models/Conversation";

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ conversations: [] });
    }

    await connectToDatabase();

    const conversations = await Conversation.find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select({
        mode: 1,
        messageCount: 1,
        avgConfidence: 1,
        duration: 1,
        startedAt: 1,
        createdAt: 1,
        "messages.role": 1,
        "messages.text": 1,
        "messages.analysis.confidenceScore": 1,
      })
      .lean();

    return NextResponse.json({
      conversations: conversations.map((c) => ({
        id: c._id,
        mode: c.mode,
        messageCount: c.messageCount,
        avgConfidence: c.avgConfidence,
        duration: c.duration,
        startedAt: c.startedAt,
        createdAt: c.createdAt,
        preview:
          c.messages && c.messages.length > 0
            ? c.messages[0].text.substring(0, 100)
            : "",
      })),
    });
  } catch (error) {
    console.error("History API error:", error);
    return NextResponse.json(
      { error: "Failed to get history" },
      { status: 500 }
    );
  }
}
