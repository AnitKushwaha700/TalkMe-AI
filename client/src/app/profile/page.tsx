"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  Award,
  Clock,
  BookOpen,
  Target,
  Brain,
  Flame,
  Calendar,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface ProfileData {
  sessionId: string;
  level: string;
  streak: number;
  totalMinutes: number;
  xp: number;
  lastActiveAt: string;
  createdAt: string;
}

interface ProgressData {
  totalConversations: number;
  totalMessages: number;
  avgConfidence: number;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/session").then((r) => r.json()),
      fetch("/api/progress").then((r) => r.json()),
    ])
      .then(([sessionData, progressData]) => {
        setProfile(sessionData);
        setProgress(progressData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl bg-muted/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const memberSince = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en", {
        month: "long",
        year: "numeric",
      })
    : "Unknown";

  const lastActive = profile?.lastActiveAt
    ? new Date(profile.lastActiveAt).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Never";

  // CEFR level color
  const levelColors: Record<string, string> = {
    A1: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
    A2: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    B1: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    B2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    C1: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    C2: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  };

  const levelDescriptions: Record<string, string> = {
    A1: "Beginner — Can use simple phrases",
    A2: "Elementary — Can handle routine tasks",
    B1: "Intermediate — Can deal with most situations",
    B2: "Upper Intermediate — Can interact fluently",
    C1: "Advanced — Flexible and effective use",
    C2: "Proficient — Near-native understanding",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Your learning journey at a glance.
        </p>
      </div>

      {/* Profile header */}
      <Card className="overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <CardContent className="relative pt-0 -mt-10 pb-6 px-6">
          <div className="flex items-end gap-4 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-background border-4 border-background shadow-lg flex items-center justify-center">
              <User className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-xl font-bold">Anonymous Learner</h2>
              <p className="text-sm text-muted-foreground">
                Member since {memberSince}
              </p>
            </div>
            <span
              className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                levelColors[profile?.level || "A1"] || levelColors.A1
              }`}
            >
              {profile?.level || "A1"}
            </span>
          </div>

          <div className="bg-muted/30 rounded-lg p-3 text-sm text-muted-foreground flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-500 shrink-0" />
            {levelDescriptions[profile?.level || "A1"] || levelDescriptions.A1}
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Flame className="w-6 h-6 text-amber-500 mb-2" />
            <p className="text-2xl font-bold">{profile?.streak || 0}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Clock className="w-6 h-6 text-blue-500 mb-2" />
            <p className="text-2xl font-bold">
              {Math.round(profile?.totalMinutes || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Zap className="w-6 h-6 text-purple-500 mb-2" />
            <p className="text-2xl font-bold">{profile?.xp || 0}</p>
            <p className="text-xs text-muted-foreground">XP Earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Target className="w-6 h-6 text-emerald-500 mb-2" />
            <p className="text-2xl font-bold">
              {progress?.avgConfidence || 0}%
            </p>
            <p className="text-xs text-muted-foreground">Avg Confidence</p>
          </CardContent>
        </Card>
      </div>

      {/* Activity summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            Activity Summary
          </CardTitle>
          <CardDescription>Your overall learning statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Total Conversations
              </span>
              <span className="font-semibold">
                {progress?.totalConversations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Total Messages
              </span>
              <span className="font-semibold">
                {progress?.totalMessages || 0}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/30">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Last Active
              </span>
              <span className="font-semibold text-sm">{lastActive}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-4 h-4" />
                Current Level
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  levelColors[profile?.level || "A1"] || levelColors.A1
                }`}
              >
                {profile?.level || "A1"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="flex justify-center pt-2">
        <Link href="/practice">
          <Button size="lg" className="gap-2">
            <Brain className="w-4 h-4" />
            Continue Practicing
          </Button>
        </Link>
      </div>
    </div>
  );
}
