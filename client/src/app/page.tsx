import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Sparkles, BrainCircuit, LineChart, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-6">
          <Sparkles className="w-3.5 h-3.5 mr-2 text-indigo-500" />
          100% Free, AI-Powered English Coach
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
          Master Spoken English with your personal <span className="text-indigo-600 dark:text-indigo-400">AI Tutor</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Practice real-life conversations, overcome the fear of speaking, and get instant feedback on pronunciation and grammar—all in your browser.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link 
            href="/practice" 
            className={buttonVariants({ size: "lg", className: "w-full sm:w-auto h-14 px-8 text-base group" })}
          >
            Start Practicing Free
            <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link 
            href="/login" 
            className={buttonVariants({ variant: "outline", size: "lg", className: "w-full sm:w-auto h-14 px-8 text-base" })}
          >
            Log In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why learn with TalkMe?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Everything you need to become a confident English speaker, powered by Google's Gemini AI.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-background/50 border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                  <Mic className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Real Voice Conversations</CardTitle>
                <CardDescription className="text-base mt-2">
                  Speak naturally. The AI listens, understands, and responds with a realistic voice just like a native speaker.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-background/50 border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Instant Feedback</CardTitle>
                <CardDescription className="text-base mt-2">
                  Get real-time corrections on grammar, better vocabulary suggestions, and pronunciation tips after every sentence.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-background/50 border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4">
                  <LineChart className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl">Track Your Progress</CardTitle>
                <CardDescription className="text-base mt-2">
                  See your CEFR level improve, monitor your daily speaking time, and review your most common mistakes.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-6">Ready to become fluent?</h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          No credit card required. No hidden fees. Just practice and improve.
        </p>
        <Link 
          href="/practice" 
          className={buttonVariants({ size: "lg", className: "h-14 px-10 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1" })}
        >
          Start Your First Conversation
        </Link>
      </section>
    </div>
  )
}