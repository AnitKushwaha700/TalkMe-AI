"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Briefcase,
  UtensilsCrossed,
  Plane,
  Building2,
  GraduationCap,
  ShoppingBag,
  Swords,
  Clock,
  TrendingUp,
  ChevronRight,
  ArrowLeft,
  User as UserIcon,
  Bot,
  XCircle,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import type { PracticeModeSlug } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  "free-talk": MessageCircle,
  interview: Briefcase,
  restaurant: UtensilsCrossed,
  airport: Plane,
  office: Building2,
  college: GraduationCap,
  shopping: ShoppingBag,
  debate: Swords,
};

const modeColorMap: Record<string, string> = {
  "free-talk": "from-violet-500 to-purple-600",
  interview: "from-blue-500 to-indigo-600",
  restaurant: "from-orange-500 to-red-500",
  airport: "from-sky-500 to-cyan-500",
  office: "from-emerald-500 to-teal-500",
  college: "from-amber-500 to-yellow-500",
  shopping: "from-pink-500 to-rose-500",
  debate: "from-red-500 to-rose-600",
};

interface ConversationPreview {
  id: string;
  mode: PracticeModeSlug;
  messageCount: number;
  avgConfidence: number;
  duration: number;
  createdAt: string;
  preview: string;
}

interface ConversationDetail {
  id: string;
  mode: string;
  messageCount: number;
  avgConfidence: number;
  createdAt: string;
  messages: Array<{
    role: "user" | "ai";
    text: string;
    analysis?: {
      grammarFixes: Array<{
        wrong: string;
        right: string;
        why: string;
        severity: string;
      }>;
      betterWords: Array<{
        youSaid: string;
        better: string;
        example: string;
      }>;
      confidenceScore: number;
      cefrLevel: string;
      encouragement?: string;
    };
    createdAt: string;
  }>;
}

export default function HistoryPage() {
  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setConversations(data.conversations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load history:", err);
        setLoading(false);
      });
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/history/${id}`);
      const data = await res.json();
      setSelectedConversation(data);
    } catch (err) {
      console.error("Failed to load conversation:", err);
    } finally {
      setLoadingDetail(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Conversation History
          </h1>
          <p className="text-muted-foreground">
            Review your past practice sessions.
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Detail view
  if (selectedConversation) {
    const ModeIcon =
      iconMap[selectedConversation.mode] || MessageCircle;
    const gradient =
      modeColorMap[selectedConversation.mode] ||
      "from-indigo-500 to-purple-600";

    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedConversation(null)}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
          >
            <ModeIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight capitalize">
              {selectedConversation.mode.replace("-", " ")}
            </h1>
            <p className="text-xs text-muted-foreground">
              {new Date(selectedConversation.createdAt).toLocaleDateString(
                "en",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </p>
          </div>
          {selectedConversation.avgConfidence > 0 && (
            <span
              className={`ml-auto text-xs font-bold px-2.5 py-1 rounded-full ${
                selectedConversation.avgConfidence >= 80
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                  : selectedConversation.avgConfidence >= 50
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
              }`}
            >
              {selectedConversation.avgConfidence}% confidence
            </span>
          )}
        </div>

        {/* Messages replay */}
        <div className="space-y-3 rounded-2xl border border-border/50 bg-muted/10 p-4">
          {loadingDetail ? (
            <div className="py-12 text-center text-muted-foreground animate-pulse">
              Loading conversation...
            </div>
          ) : (
            selectedConversation.messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%] sm:max-w-[75%]">
                  <div className="flex items-center gap-2 mb-1">
                    {msg.role === "user" ? (
                      <UserIcon className="w-3.5 h-3.5 text-muted-foreground" />
                    ) : (
                      <Bot className="w-3.5 h-3.5 text-indigo-500" />
                    )}
                    <span className="text-[10px] text-muted-foreground/60">
                      {msg.role === "user" ? "You" : "AI Coach"}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-sm"
                        : "bg-card text-card-foreground border border-border/50 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                      {msg.text}
                    </p>
                  </div>

                  {/* Inline analysis */}
                  {msg.role === "ai" && msg.analysis && (
                    <div className="mt-1.5 space-y-1 pl-1">
                      {msg.analysis.grammarFixes?.map((fix, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-1.5 text-[11px] text-rose-600 dark:text-rose-400"
                        >
                          <XCircle className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>
                            <span className="line-through opacity-70">
                              {fix.wrong}
                            </span>{" "}
                            →{" "}
                            <span className="font-medium">{fix.right}</span>
                          </span>
                        </div>
                      ))}
                      {msg.analysis.betterWords?.map((word, j) => (
                        <div
                          key={j}
                          className="flex items-start gap-1.5 text-[11px] text-amber-600 dark:text-amber-400"
                        >
                          <Lightbulb className="w-3 h-3 mt-0.5 shrink-0" />
                          <span>
                            &ldquo;{word.youSaid}&rdquo; →{" "}
                            <span className="font-medium">
                              &ldquo;{word.better}&rdquo;
                            </span>
                          </span>
                        </div>
                      ))}
                      {msg.analysis.confidenceScore > 0 && (
                        <div className="text-[10px] text-muted-foreground/60 mt-1">
                          {msg.analysis.confidenceScore}% •{" "}
                          {msg.analysis.cefrLevel}
                        </div>
                      )}
                    </div>
                  )}

                  <p className="text-[10px] text-muted-foreground/40 mt-1 px-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="flex justify-center pt-2">
          <Link href={`/voice?mode=${selectedConversation.mode}`}>
            <Button className="gap-2">
              <MessageCircle className="w-4 h-4" />
              Continue Practicing {selectedConversation.mode.replace("-", " ")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Conversation History
        </h1>
        <p className="text-muted-foreground">
          Review your past practice sessions and track your improvement.
        </p>
      </div>

      {conversations.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No conversations yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start your first practice session to see your conversation history
              here.
            </p>
            <Link href="/practice">
              <Button>Start Practicing</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {conversations.map((conv, i) => {
              const ModeIcon = iconMap[conv.mode] || MessageCircle;
              const gradient =
                modeColorMap[conv.mode] || "from-indigo-500 to-purple-600";

              return (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() => loadConversation(conv.id)}
                    className="w-full text-left"
                  >
                    <Card className="hover:shadow-md transition-all cursor-pointer group hover:border-primary/30">
                      <CardContent className="flex items-center gap-4 p-4">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
                        >
                          <ModeIcon className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-semibold text-sm capitalize">
                              {conv.mode.replace("-", " ")}
                            </h3>
                            {conv.avgConfidence > 0 && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                                  conv.avgConfidence >= 80
                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                                    : conv.avgConfidence >= 50
                                      ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                      : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                }`}
                              >
                                {conv.avgConfidence}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {conv.preview || "No preview available"}
                          </p>
                          <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground/60">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {conv.messageCount} messages
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(conv.createdAt).toLocaleDateString(
                                "en",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-foreground transition-colors" />
                      </CardContent>
                    </Card>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
