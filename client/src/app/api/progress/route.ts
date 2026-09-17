import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models/User";
import { Conversation } from "@/lib/models/Conversation";
import { Mistake } from "@/lib/models/Mistake";

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({
        streak: 0,
        totalMinutes: 0,
        xp: 0,
        level: "A1",
        totalConversations: 0,
        totalMessages: 0,
        avgConfidence: 0,
        recentMistakes: [],
        weeklyActivity: [],
      });
    }

    await connectToDatabase();

    // Get user stats
    const user = await User.findOne({ sessionId }).lean();

    // Get conversation stats
    const conversations = await Conversation.find({ sessionId })
      .sort({ createdAt: -1 })
      .lean();

    const totalConversations = conversations.length;
    const totalMessages = conversations.reduce(
      (sum, c) => sum + (c.messageCount || 0),
      0
    );
    const avgConfidence =
      totalConversations > 0
        ? Math.round(
            conversations.reduce(
              (sum, c) => sum + (c.avgConfidence || 0),
              0
            ) / totalConversations
          )
        : 0;

    // Get recent mistakes
    const recentMistakes = await Mistake.find({ sessionId })
      .sort({ lastSeen: -1 })
      .limit(10)
      .lean();

    // Calculate weekly activity (last 7 days)
    const now = new Date();
    const weeklyActivity = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));

      const dayConversations = conversations.filter((c) => {
        const created = new Date(c.createdAt);
        return created >= dayStart && created <= dayEnd;
      });

      weeklyActivity.push({
        date: dayStart.toISOString().split("T")[0],
        day: dayStart.toLocaleDateString("en", { weekday: "short" }),
        conversations: dayConversations.length,
        messages: dayConversations.reduce(
          (sum, c) => sum + (c.messageCount || 0),
          0
        ),
        minutes: dayConversations.reduce(
          (sum, c) => sum + (c.duration || 0),
          0
        ),
      });
    }

    return NextResponse.json({
      streak: user?.streak || 0,
      totalMinutes: user?.totalMinutes || 0,
      xp: user?.xp || 0,
      level: user?.level || "A1",
      totalConversations,
      totalMessages,
      avgConfidence,
      recentMistakes: recentMistakes.map((m) => ({
        id: m._id,
        type: m.type,
        wrong: m.wrong,
        right: m.right,
        why: m.why,
        occurrences: m.occurrences,
        lastSeen: m.lastSeen,
      })),
      weeklyActivity,
    });
  } catch (error) {
    console.error("Progress API error:", error);
    return NextResponse.json(
      { error: "Failed to get progress" },
      { status: 500 }
    );
  }
}
