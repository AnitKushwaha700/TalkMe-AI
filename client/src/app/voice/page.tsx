"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Settings2,
  Send,
  RotateCcw,
  Keyboard,
} from "lucide-react";

import { VoiceOrb } from "@/features/voice/components/VoiceOrb";
import { LiveTranscript } from "@/features/voice/components/LiveTranscript";
import { ChatBubble } from "@/features/chat/components/ChatBubble";
import { TypingIndicator } from "@/features/chat/components/TypingIndicator";
import { FeedbackPanel } from "@/features/chat/components/FeedbackPanel";

import { useSpeechRecognition } from "@/features/voice/hooks/useSpeechRecognition";
import { useSpeechSynthesis } from "@/features/voice/hooks/useSpeechSynthesis";
import { useSilenceDetector } from "@/features/voice/hooks/useSilenceDetector";
import { useChatStream } from "@/features/chat/hooks/useChatStream";

import { getPracticeModeBySlug, PRACTICE_MODES } from "@/constants/practice-modes";
import type { AIResponse, PracticeModeSlug, VoiceState } from "@/types";

function VoiceChat() {
  const searchParams = useSearchParams();
  const modeSlug = (searchParams.get("mode") || "free-talk") as PracticeModeSlug;
  const mode = getPracticeModeBySlug(modeSlug) || PRACTICE_MODES[0];

  // State
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [lastResponse, setLastResponse] = useState<AIResponse | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const hasGreetedRef = useRef(false);

  // Hooks
  const { messages, isLoading, sendMessage, clearMessages, addAIMessage } =
    useChatStream({
      mode: modeSlug,
      onResponse: (response) => {
        setLastResponse(response);
        setShowFeedback(true);
      },
    });

  const tts = useSpeechSynthesis();

  const handleSendTranscript = useCallback(
    async (text: string) => {
      if (!text.trim()) return;

      setVoiceState("processing");

      // Cancel TTS if AI was speaking (barge-in)
      if (tts.isSpeaking) {
        tts.cancel();
      }

      const response = await sendMessage(text);

      if (response?.reply) {
        setVoiceState("speaking");
        tts.speak(response.reply);

        // Wait for TTS to finish, then go back to idle
        const checkSpeaking = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            clearInterval(checkSpeaking);
            setVoiceState("idle");
          }
        }, 200);
      } else {
        setVoiceState("idle");
      }
    },
    [sendMessage, tts]
  );

  const silenceDetector = useSilenceDetector({
    silenceThresholdMs: 1500,
    enabled: voiceState === "listening",
    onSilenceDetected: () => {
      // Auto-send on silence
      speech.stop();
    },
  });

  const speech = useSpeechRecognition({
    language: "en-US",
    continuous: true,
    interimResults: true,
    onResult: (result) => {
      if (result.isFinal || result.transcript.length > 3) {
        silenceDetector.reset();
      }

      // Barge-in: if AI is speaking and user starts talking
      if (tts.isSpeaking && result.transcript.length > 3) {
        tts.cancel();
        setVoiceState("listening");
      }
    },
    onEnd: () => {
      // When recognition ends, send the transcript
      if (speech.transcript.trim()) {
        handleSendTranscript(speech.transcript);
      } else {
        setVoiceState("idle");
      }
    },
    onError: (error) => {
      console.error("Speech error:", error);
      setVoiceState("error");
      setTimeout(() => setVoiceState("idle"), 2000);
    },
  });

  // Handle orb click
  const handleOrbClick = useCallback(() => {
    switch (voiceState) {
      case "idle":
      case "error":
        speech.start();
        setVoiceState("listening");
        setShowFeedback(false);
        break;
      case "listening":
        speech.stop();
        break;
      case "speaking":
        tts.cancel();
        setVoiceState("idle");
        break;
      case "processing":
        // Can't interrupt processing
        break;
    }
  }, [voiceState, speech, tts]);

  // Handle text input submit
  const handleTextSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (textInput.trim()) {
        handleSendTranscript(textInput.trim());
        setTextInput("");
      }
    },
    [textInput, handleSendTranscript]
  );

  // Send opening message on mount
  useEffect(() => {
    if (!hasGreetedRef.current && mode) {
      hasGreetedRef.current = true;
      addAIMessage(mode.openingPrompt);
    }
  }, [mode, addAIMessage]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // New conversation
  const handleNewConversation = useCallback(() => {
    clearMessages();
    tts.cancel();
    speech.reset();
    setVoiceState("idle");
    setLastResponse(null);
    setShowFeedback(false);
    hasGreetedRef.current = false;
  }, [clearMessages, tts, speech]);

  const silenceProgress =
    voiceState === "listening"
      ? Math.min(silenceDetector.timeSinceLastSpeech / 1500, 1)
      : 0;

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <div
            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${mode.gradient} flex items-center justify-center`}
          >
            <span className="text-white text-sm font-bold">
              {mode.title[0]}
            </span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">{mode.title}</h1>
            <p className="text-xs text-muted-foreground">{mode.aiPersona}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNewConversation}
            title="New conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowTextInput(!showTextInput)}
            title="Toggle text input"
          >
            <Keyboard className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Settings">
            <Settings2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col rounded-2xl border border-border/50 bg-muted/20 overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <ChatBubble key={msg.id} message={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={chatEndRef} />
        </div>

        {/* Voice controls area */}
        <div className="border-t border-border/30 bg-background/80 backdrop-blur-sm">
          {/* Live transcript */}
          <AnimatePresence>
            {(voiceState === "listening" ||
              speech.transcript ||
              speech.interimTranscript) && (
              <div className="px-4 pt-3">
                <LiveTranscript
                  transcript={speech.transcript}
                  interimTranscript={speech.interimTranscript}
                  isListening={voiceState === "listening"}
                />
              </div>
            )}
          </AnimatePresence>

          {/* Orb */}
          <div className="flex justify-center py-5">
            <VoiceOrb
              state={voiceState}
              onClick={handleOrbClick}
              silenceProgress={silenceProgress}
            />
          </div>

          {/* Text input (toggle) */}
          <AnimatePresence>
            {showTextInput && (
              <motion.form
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleTextSubmit}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="flex gap-2">
                  <Input
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                    disabled={isLoading}
                    maxLength={500}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!textInput.trim() || isLoading}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* Feedback panel */}
        <FeedbackPanel response={lastResponse} isVisible={showFeedback} />
      </div>

      {/* Browser support notice */}
      {!speech.isSupported && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-lg"
        >
          ⚠️ Voice input requires Chrome or Edge. You can still use text input
          below.
        </motion.div>
      )}
    </div>
  );
}

export default function VoiceChatPage() {
  return (
    <Suspense fallback={<div className="flex h-[calc(100vh-5rem)] items-center justify-center">Loading...</div>}>
      <VoiceChat />
    </Suspense>
  );
}
