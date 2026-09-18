"use client";

import { motion, AnimatePresence } from "framer-motion";

interface LiveTranscriptProps {
  transcript: string;
  interimTranscript: string;
  isListening: boolean;
}

export function LiveTranscript({
  transcript,
  interimTranscript,
  isListening,
}: LiveTranscriptProps) {
  const hasContent = transcript || interimTranscript;

  if (!isListening && !hasContent) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="w-full max-w-lg mx-auto"
      >
        <div className="relative rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 px-5 py-4 min-h-[60px]">
          {/* Live indicator */}
          {isListening && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Live
              </span>
            </div>
          )}

          {/* Transcript text */}
          <p className="text-base leading-relaxed pr-14">
            {transcript && (
              <span className="text-foreground">{transcript}</span>
            )}
            {interimTranscript && (
              <span className="text-muted-foreground/70 italic">
                {transcript ? " " : ""}
                {interimTranscript}
              </span>
            )}
            {isListening && !hasContent && (
              <span className="text-muted-foreground/50 italic">
                Start speaking...
              </span>
            )}
            {/* Blinking cursor */}
            {isListening && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="inline-block w-0.5 h-5 bg-indigo-500 ml-0.5 align-middle"
              />
            )}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
