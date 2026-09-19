"use client";

import { motion } from "framer-motion";
import type { ChatMessage } from "@/types";
import { CheckCircle2, XCircle, Lightbulb, TrendingUp } from "lucide-react";

interface ChatBubbleProps {
  message: ChatMessage;
  showFeedback?: boolean;
}

export function ChatBubble({
  message,
  showFeedback = true,
}: ChatBubbleProps) {
  const isUser = message.role === "user";
  const analysis = message.analysis;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} group`}
    >
      <div
        className={`max-w-[85%] sm:max-w-[75%] ${
          isUser ? "order-1" : "order-1"
        }`}
      >
        {/* Message bubble */}
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm ${
            isUser
              ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm"
              : "bg-card text-card-foreground border border-border/50 rounded-tl-sm"
          }`}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>
        </div>

        {/* Feedback section — only for AI messages with analysis */}
        {!isUser && analysis && showFeedback && (
          <div className="mt-2 space-y-1.5 pl-1">
            {/* Grammar fixes */}
            {analysis.grammarFixes.length > 0 &&
              analysis.grammarFixes.map((fix, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-start gap-2 text-xs bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 px-3 py-2 rounded-lg border border-rose-200/50 dark:border-rose-800/30"
                >
                  <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <span className="line-through opacity-70">{fix.wrong}</span>
                    {" → "}
                    <span className="font-medium">{fix.right}</span>
                    <span className="block text-[10px] opacity-70 mt-0.5">
                      {fix.why}
                    </span>
                  </div>
                </motion.div>
              ))}

            {/* Better words */}
            {analysis.betterWords.length > 0 &&
              analysis.betterWords.map((word, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay:
                      0.3 +
                      (analysis.grammarFixes.length + i) * 0.1,
                  }}
                  className="flex items-start gap-2 text-xs bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 px-3 py-2 rounded-lg border border-amber-200/50 dark:border-amber-800/30"
                >
                  <Lightbulb className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                  <div>
                    <span className="opacity-70">&ldquo;{word.youSaid}&rdquo;</span>
                    {" → "}
                    <span className="font-medium">&ldquo;{word.better}&rdquo;</span>
                    <span className="block text-[10px] opacity-70 mt-0.5">
                      {word.example}
                    </span>
                  </div>
                </motion.div>
              ))}

            {/* Confidence & Encouragement */}
            {(analysis.confidenceScore > 0 || analysis.encouragement) && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-start gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/30"
              >
                {analysis.confidenceScore > 0 ? (
                  <TrendingUp className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                )}
                <div>
                  {analysis.confidenceScore > 0 && (
                    <span className="font-medium">
                      {analysis.confidenceScore}% confidence ({analysis.cefrLevel})
                    </span>
                  )}
                  {analysis.encouragement && (
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      {analysis.encouragement}
                    </span>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] text-muted-foreground/50 mt-1 ${
            isUser ? "text-right" : "text-left"
          } px-1`}
        >
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
}
