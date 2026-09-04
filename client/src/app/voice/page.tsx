"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Settings2, PlaySquare } from "lucide-react"
import { useState } from "react"

export default function VoiceAssistantPage() {
  const [isListening, setIsListening] = useState(false)

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Voice Assistant</h1>
          <p className="text-muted-foreground">Speak naturally. The AI will respond and provide feedback.</p>
        </div>
        <Button variant="outline" size="icon">
          <Settings2 className="w-4 h-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col relative overflow-hidden bg-muted/30">
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Placeholder Chat History */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-start">
              <div className="bg-card text-card-foreground p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                <p>Hello! I'm your English coach. What would you like to talk about today?</p>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="bg-primary text-primary-foreground p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                <p>I want to practice for a job interview.</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-card text-card-foreground p-4 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm space-y-2">
                <p>Great! Let's start with a common question: <strong>"Can you tell me a little about yourself?"</strong></p>
                <div className="flex items-center gap-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-2 rounded-md mt-2">
                  <PlaySquare className="w-3 h-3" />
                  <span>Grammar tip: "I want to practice" is perfect!</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        {/* Voice Controls */}
        <div className="p-6 bg-background border-t flex flex-col items-center justify-center gap-4">
          <div className="text-sm text-muted-foreground">
            {isListening ? "Listening..." : "Click the microphone to start speaking"}
          </div>
          
          <Button 
            size="lg" 
            className={`w-20 h-20 rounded-full shadow-lg ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
            onClick={() => setIsListening(!isListening)}
          >
            {isListening ? (
              <MicOff className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
