"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, BookOpen, Target, Brain, AlertCircle } from "lucide-react"
import Link from "next/link";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    totalMinutes?: number;
    totalConversations?: number;
    totalMessages?: number;
    avgConfidence?: number;
    streak?: number;
    level?: string;
    recentMistakes?: Array<{
      id: string;
      wrong: string;
      right: string;
      why: string;
      occurrences: number;
    }>;
  } | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load progress:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Track your English learning progress and statistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Speaking Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data?.totalMinutes || 0)}m</div>
            <p className="text-xs text-muted-foreground">Keep talking to improve!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalConversations || 0}</div>
            <p className="text-xs text-muted-foreground">{data?.totalMessages || 0} total messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.avgConfidence || 0}%</div>
            <p className="text-xs text-muted-foreground">Based on AI evaluation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.streak || 0} Days</div>
            <p className="text-xs text-muted-foreground">Current Level: {data?.level || 'A1'}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Mistakes to Review</CardTitle>
            <CardDescription>Common grammar issues you should watch out for.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.recentMistakes && data.recentMistakes.length > 0 ? (
                 data.recentMistakes.map((mistake) => (
                  <div key={mistake.id} className="flex flex-col space-y-1 bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                      <span className="text-sm font-medium line-through text-muted-foreground">{mistake.wrong}</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">→ {mistake.right}</span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-6">{mistake.why} (Seen {mistake.occurrences} times)</p>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground italic p-4 text-center">No mistakes recorded yet. Keep practicing!</div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Daily Goal</CardTitle>
            <CardDescription>Speak for 30 minutes today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex flex-col items-center justify-center pt-8">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                <circle 
                  cx="64" cy="64" r="60" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  fill="transparent" 
                  strokeDasharray={`${Math.min((data?.totalMinutes || 0) / 30 * 377, 377)} 377`}
                  className="text-primary transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold">{Math.round(data?.totalMinutes || 0)}</span>
                <span className="text-xs text-muted-foreground">/ 30 min</span>
              </div>
            </div>
            
            <Link href="/practice" className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium">
              Continue Practice
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
