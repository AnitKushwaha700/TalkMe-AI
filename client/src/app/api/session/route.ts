import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { User } from "@/lib/models/User";

export async function GET() {
  try {
    const sessionId = await getOrCreateSessionId();

    await connectToDatabase();

    // Find or create user
    const user = await User.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          level: "A1",
          streak: 0,
          totalMinutes: 0,
          xp: 0,
        },
        $set: { lastActiveAt: new Date() },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      sessionId: user.sessionId,
      level: user.level,
      streak: user.streak,
      totalMinutes: user.totalMinutes,
      xp: user.xp,
      lastActiveAt: user.lastActiveAt,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Session API error:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}
