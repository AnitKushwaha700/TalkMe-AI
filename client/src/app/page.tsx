"use client"

import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Mic, Sparkles, BrainCircuit, LineChart, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12">
      
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl space-y-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Google Gemini AI</span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Master Spoken English with your <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">Personal AI Coach</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          Practice real-life conversations, get instant feedback on pronunciation and grammar, and build your confidence without the fear of judgment.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/voice" className={buttonVariants({ size: "lg", className: "w-full sm:w-auto text-lg px-8 rounded-full shadow-lg hover:shadow-xl transition-all" })}>
            Start Speaking Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto text-lg px-8 rounded-full" })}>
            View Progress
          </Link>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-12"
      >
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Mic className="w-6 h-6" />
            </div>
            <CardTitle>Voice Conversations</CardTitle>
            <CardDescription>Speak naturally to your AI coach and get human-like voice responses in real-time.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <CardTitle>Intelligent Feedback</CardTitle>
            <CardDescription>Receive instant corrections on grammar, vocabulary suggestions, and better ways to phrase your sentences.</CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors">
          <CardHeader>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
              <LineChart className="w-6 h-6" />
            </div>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>Monitor your speaking minutes, vocabulary growth, and see your communication skills improve over time.</CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  )
}