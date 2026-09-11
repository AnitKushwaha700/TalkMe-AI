import { NextResponse } from "next/server";
import { getSessionId } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import { Mistake } from "@/lib/models/Mistake";

export async function GET() {
  try {
    const sessionId = await getSessionId();

    if (!sessionId) {
      return NextResponse.json({ mistakes: [] });
    }

    await connectToDatabase();

    const mistakes = await Mistake.find({ sessionId })
      .sort({ occurrences: -1, lastSeen: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({
      mistakes: mistakes.map((m) => ({
        id: m._id,
        type: m.type,
        wrong: m.wrong,
        right: m.right,
        why: m.why,
        occurrences: m.occurrences,
        lastSeen: m.lastSeen,
      })),
    });
  } catch (error) {
    console.error("Grammar API error:", error);
    return NextResponse.json(
      { error: "Failed to get grammar data" },
      { status: 500 }
    );
  }
}
