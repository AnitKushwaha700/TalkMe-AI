import { NextRequest, NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { Conversation } from "@/lib/models/Conversation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionId = await getSessionId();
    const { id } = await params;

    if (!sessionId) {
      return NextResponse.json(
        { error: "No session found" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const conversation = await Conversation.findOne({
      _id: id,
      sessionId, // Ensure user can only access their own conversations
    }).lean();

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: conversation._id,
      mode: conversation.mode,
      messageCount: conversation.messageCount,
      avgConfidence: conversation.avgConfidence,
      duration: conversation.duration,
      startedAt: conversation.startedAt,
      createdAt: conversation.createdAt,
      messages: conversation.messages.map((m) => ({
        role: m.role,
        text: m.text,
        analysis: m.analysis,
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("Conversation detail API error:", error);
    return NextResponse.json(
      { error: "Failed to get conversation" },
      { status: 500 }
    );
  }
}
