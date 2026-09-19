"use client";

import { motion } from "framer-motion";
import type { AIResponse } from "@/types";
import {
  XCircle,
  Lightbulb,
  TrendingUp,
  Volume2,
  Award,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

interface FeedbackPanelProps {
  response: AIResponse | null;
  isVisible: boolean;
}

export function FeedbackPanel({ response, isVisible }: FeedbackPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!response || !isVisible) return null;

  const hasGrammar = response.grammarFixes.length > 0;
  const hasVocab = response.betterWords.length > 0;
  const hasTip = !!response.pronunciationTip;
  const hasFeedback = hasGrammar || hasVocab || hasTip;

  if (!hasFeedback && response.confidenceScore === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full border-t border-border/50 bg-card/50 backdrop-blur-sm"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium">Feedback</span>
          {response.confidenceScore > 0 && (
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                response.confidenceScore >= 80
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : response.confidenceScore >= 50
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
              }`}
            >
              {response.confidenceScore}% • {response.cefrLevel}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="px-5 pb-4 space-y-3"
        >
          {/* Grammar Fixes */}
          {hasGrammar && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-3 h-3" />
                Grammar Corrections
              </h4>
              {response.grammarFixes.map((fix, i) => (
                <div
                  key={i}
                  className="text-sm bg-rose-50 dark:bg-rose-950/20 px-3 py-2 rounded-lg border border-rose-200/30 dark:border-rose-800/20"
                >
                  <span className="line-through text-rose-400">
                    {fix.wrong}
                  </span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {fix.right}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {fix.why}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Vocabulary */}
          {hasVocab && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" />
                Better Vocabulary
              </h4>
              {response.betterWords.map((word, i) => (
                <div
                  key={i}
                  className="text-sm bg-amber-50 dark:bg-amber-950/20 px-3 py-2 rounded-lg border border-amber-200/30 dark:border-amber-800/20"
                >
                  <span className="text-muted-foreground">
                    &ldquo;{word.youSaid}&rdquo;
                  </span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium text-amber-700 dark:text-amber-300">
                    &ldquo;{word.better}&rdquo;
                  </span>
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    {word.example}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Pronunciation Tip */}
          {hasTip && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-3 h-3" />
                Pronunciation Tip
              </h4>
              <p className="text-sm bg-blue-50 dark:bg-blue-950/20 px-3 py-2 rounded-lg border border-blue-200/30 dark:border-blue-800/20">
                {response.pronunciationTip}
              </p>
            </div>
          )}

          {/* Encouragement */}
          {response.encouragement && (
            <div className="flex items-start gap-2 text-sm bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 px-3 py-2 rounded-lg border border-emerald-200/30 dark:border-emerald-800/20">
              <TrendingUp className="w-4 h-4 mt-0.5 shrink-0" />
              <p>{response.encouragement}</p>
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
