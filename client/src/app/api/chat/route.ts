import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse } from "@/features/coach/services/gemini";
import { parseAIResponse } from "@/features/coach/parsers/streamParser";
import { getPracticeModeBySlug } from "@/constants/practice-modes";
import { getOrCreateSessionId } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { chatRequestSchema } from "@/lib/validators";
import connectToDatabase from "@/lib/db";
import { Conversation } from "@/lib/models/Conversation";
import { User } from "@/lib/models/User";
import { Mistake } from "@/lib/models/Mistake";
import { Progress } from "@/lib/models/Progress";

export const maxDuration = 30; // Vercel function timeout

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Zod validation
    const parseResult = chatRequestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Invalid input." },
        { status: 400 }
      );
    }

    const { message, mode: modeSlug, conversationId, history } = parseResult.data;

    const mode = getPracticeModeBySlug(modeSlug);
    if (!mode) {
      return NextResponse.json(
        { error: "Invalid practice mode." },
        { status: 400 }
      );
    }

    // Get or create session
    const sessionId = await getOrCreateSessionId();

    // Rate limiting: 20 messages per day per session
    const rateLimit = checkRateLimit(`chat:${sessionId}`, {
      maxRequests: 20,
      windowMs: 24 * 60 * 60 * 1000,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Daily limit reached. Come back tomorrow!",
          reply: "You've been practicing a lot today! Take a break and come back tomorrow for more practice. 🎉",
          grammarFixes: [],
          betterWords: [],
          pronunciationTip: "",
          confidenceScore: 0,
          cefrLevel: "B1",
          encouragement: "Great dedication! Rest up and we'll practice more tomorrow.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Remaining": rateLimit.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimit.resetAt).toISOString(),
          },
        }
      );
    }

    // Generate AI response
    const rawResponse = await generateChatResponse(mode, message, history);
    const aiResponse = parseAIResponse(rawResponse);

    // Save to database (non-blocking — don't await for faster response)
    const dbResult = saveToDatabase(
      sessionId,
      modeSlug,
      conversationId,
      message,
      aiResponse
    );

    // Wait just enough to get the conversation ID, but don't block for full save
    let newConversationId = conversationId;
    try {
      const conversation = await dbResult;
      newConversationId = conversation?._id?.toString() || conversationId;
    } catch (err) {
      console.error("DB save error:", err);
    }

    const response = NextResponse.json(aiResponse);

    // Return conversation ID in header so client can track it
    if (newConversationId) {
      response.headers.set("x-conversation-id", newConversationId);
    }

    // Rate limit info headers
    response.headers.set(
      "X-RateLimit-Remaining",
      rateLimit.remaining.toString()
    );

    return response;
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong. Please try again.",
        reply: "I'm having trouble right now. Could you try again in a moment?",
        grammarFixes: [],
        betterWords: [],
        pronunciationTip: "",
        confidenceScore: 0,
        cefrLevel: "B1",
        encouragement: "",
      },
      { status: 500 }
    );
  }
}

async function saveToDatabase(
  sessionId: string,
  mode: string,
  conversationId: string | undefined,
  userMessage: string,
  aiResponse: ReturnType<typeof parseAIResponse>
) {
  await connectToDatabase();

  // Ensure user exists and update activity
  await User.findOneAndUpdate(
    { sessionId },
    {
      $setOnInsert: { sessionId },
      $set: { lastActiveAt: new Date() },
      $inc: { xp: 5 }, // 5 XP per message
    },
    { upsert: true, new: true }
  );

  // Create or update conversation
  const userMsg = {
    role: "user" as const,
    text: userMessage,
    createdAt: new Date(),
  };

  const aiMsg = {
    role: "ai" as const,
    text: aiResponse.reply,
    analysis: {
      grammarFixes: aiResponse.grammarFixes,
      betterWords: aiResponse.betterWords,
      confidenceScore: aiResponse.confidenceScore,
      cefrLevel: aiResponse.cefrLevel,
      pronunciationTip: aiResponse.pronunciationTip,
      encouragement: aiResponse.encouragement,
    },
    createdAt: new Date(),
  };

  let conversation;
  if (conversationId) {
    conversation = await Conversation.findByIdAndUpdate(
      conversationId,
      {
        $push: { messages: { $each: [userMsg, aiMsg] } },
        $inc: { messageCount: 2 },
        $set: {
          avgConfidence: aiResponse.confidenceScore,
        },
      },
      { new: true }
    );
  } else {
    conversation = await Conversation.create({
      sessionId,
      mode,
      messages: [userMsg, aiMsg],
      messageCount: 2,
      avgConfidence: aiResponse.confidenceScore,
    });
  }

  // Save grammar mistakes for review
  for (const fix of aiResponse.grammarFixes) {
    await Mistake.findOneAndUpdate(
      { sessionId, wrong: fix.wrong, right: fix.right },
      {
        $setOnInsert: {
          sessionId,
          type: "grammar",
          wrong: fix.wrong,
          right: fix.right,
          why: fix.why,
        },
        $inc: { occurrences: 1 },
        $set: { lastSeen: new Date() },
      },
      { upsert: true }
    );
  }

  // Update daily progress
  const today = new Date().toISOString().split("T")[0];
  await Progress.findOneAndUpdate(
    { sessionId, date: today },
    {
      $setOnInsert: { sessionId, date: today },
      $inc: {
        messages: 2,
        minutes: 1, // Approximate 1 minute per exchange
        newWords: aiResponse.betterWords.length,
      },
      $set: {
        grammarScore: aiResponse.confidenceScore,
        streakMaintained: true,
      },
    },
    { upsert: true }
  );

  // Update user streak (check if they practiced yesterday)
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const yesterdayProgress = await Progress.findOne({
    sessionId,
    date: yesterdayStr,
  });

  // If they practiced yesterday or this is their first day, maintain streak
  if (yesterdayProgress || !(await Progress.findOne({ sessionId, date: { $lt: today } }))) {
    const todayProgress = await Progress.findOne({ sessionId, date: today });
    if (todayProgress && !todayProgress.streakMaintained) {
      // First message of the day — increment streak
      await User.findOneAndUpdate(
        { sessionId },
        { $inc: { streak: 1 } }
      );
    }
  } else {
    // Broke streak — reset to 1
    await User.findOneAndUpdate(
      { sessionId },
      { $set: { streak: 1 } }
    );
  }

  return conversation;
}
