"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  ArrowRight,
  BookOpen,
  Search,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface WordEntry {
  youSaid: string;
  better: string;
  example: string;
  count: number;
}

export default function VocabularyPage() {
  const [words, setWords] = useState<WordEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("/api/vocabulary")
      .then((res) => res.json())
      .then((data) => {
        setWords(data.words || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load vocabulary:", err);
        setLoading(false);
      });
  }, []);

  const filteredWords = searchQuery
    ? words.filter(
        (w) =>
          w.youSaid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          w.better.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : words;

  const totalSuggestions = words.reduce((sum, w) => sum + w.count, 0);

  if (loading) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Word Bank</h1>
          <p className="text-muted-foreground">Loading your vocabulary...</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Word Bank</h1>
        <p className="text-muted-foreground">
          Better vocabulary alternatives suggested during your practice sessions.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {words.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Words Learned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {totalSuggestions}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total Suggestions
            </p>
          </CardContent>
        </Card>
      </div>

      {words.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Sparkles className="w-12 h-12 text-amber-400/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No vocabulary suggestions yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              As you practice, the AI will suggest better words and phrases.
              They&apos;ll appear here for review.
            </p>
            <Link href="/practice">
              <Button>Start Practicing</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Word cards */}
          <div className="grid gap-3 md:grid-cols-2">
            <AnimatePresence>
              {filteredWords.map((word, i) => (
                <motion.div
                  key={`${word.youSaid}-${word.better}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow group h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-sm text-muted-foreground">
                            &ldquo;{word.youSaid}&rdquo;
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
                          <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                            &ldquo;{word.better}&rdquo;
                          </span>
                        </div>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                          {word.count}x
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-xs text-muted-foreground pl-9">
                        <BookOpen className="w-3 h-3 mt-0.5 shrink-0" />
                        <p className="italic">{word.example}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredWords.length === 0 && searchQuery && (
            <div className="text-center py-8 text-muted-foreground">
              No words matching &ldquo;{searchQuery}&rdquo;
            </div>
          )}
        </>
      )}
    </div>
  );
}
