"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  BookOpen,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface MistakeData {
  id: string;
  type: string;
  wrong: string;
  right: string;
  why: string;
  occurrences: number;
  lastSeen: string;
}

export default function GrammarPage() {
  const [mistakes, setMistakes] = useState<MistakeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "frequent" | "recent">("all");

  useEffect(() => {
    fetch("/api/grammar")
      .then((res) => res.json())
      .then((data) => {
        setMistakes(data.mistakes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load grammar data:", err);
        setLoading(false);
      });
  }, []);

  const filteredMistakes = (() => {
    switch (filter) {
      case "frequent":
        return [...mistakes].sort((a, b) => b.occurrences - a.occurrences);
      case "recent":
        return [...mistakes].sort(
          (a, b) =>
            new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
        );
      default:
        return mistakes;
    }
  })();

  const totalMistakes = mistakes.reduce(
    (sum, m) => sum + m.occurrences,
    0
  );
  const uniqueMistakes = mistakes.length;
  const mostCommon = mistakes.length > 0 ? mistakes[0] : null;

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grammar Review</h1>
          <p className="text-muted-foreground">
            Loading your grammar patterns...
          </p>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grammar Review</h1>
        <p className="text-muted-foreground">
          Learn from your common mistakes and improve your grammar accuracy.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-rose-600 dark:text-rose-400">
              {uniqueMistakes}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Unique Patterns
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {totalMistakes}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total Occurrences
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {mostCommon?.occurrences || 0}x
            </p>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {mostCommon
                ? `"${mostCommon.wrong}" → "${mostCommon.right}"`
                : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {mistakes.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No grammar mistakes yet!
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Start practicing to get grammar corrections. Your mistakes will
              appear here for review.
            </p>
            <Link href="/practice">
              <Button>Start Practicing</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Filter buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            {(["all", "frequent", "recent"] as const).map((f) => (
              <Button
                key={f}
                variant={filter === f ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(f)}
                className="text-xs capitalize"
              >
                {f === "all" ? "All" : f === "frequent" ? "Most Frequent" : "Most Recent"}
              </Button>
            ))}
          </div>

          {/* Mistake cards */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredMistakes.map((mistake, i) => (
                <motion.div
                  key={mistake.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex items-stretch">
                        {/* Severity indicator */}
                        <div
                          className={`w-1.5 shrink-0 ${
                            mistake.occurrences >= 5
                              ? "bg-rose-500"
                              : mistake.occurrences >= 3
                                ? "bg-amber-500"
                                : "bg-blue-400"
                          }`}
                        />

                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              <span className="text-sm line-through text-muted-foreground">
                                {mistake.wrong}
                              </span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                                {mistake.right}
                              </span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                mistake.occurrences >= 5
                                  ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                                  : mistake.occurrences >= 3
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                                    : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              }`}
                            >
                              {mistake.occurrences}x
                            </span>
                          </div>

                          <div className="flex items-start gap-2 text-xs text-muted-foreground pl-6">
                            <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                            <p>{mistake.why}</p>
                          </div>

                          <p className="text-[10px] text-muted-foreground/40 mt-2 pl-6">
                            Last seen:{" "}
                            {new Date(mistake.lastSeen).toLocaleDateString(
                              "en",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
}
