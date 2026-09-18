"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { VoiceState } from "@/types";
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react";

interface VoiceOrbProps {
  state: VoiceState;
  onClick: () => void;
  silenceProgress?: number; // 0-1, how close to silence threshold
}

const stateConfig: Record<
  VoiceState,
  {
    label: string;
    bgClass: string;
    pulseColor: string;
    icon: React.ElementType;
  }
> = {
  idle: {
    label: "Tap to speak",
    bgClass: "bg-gradient-to-br from-indigo-500 to-purple-600",
    pulseColor: "rgba(99, 102, 241, 0.3)",
    icon: Mic,
  },
  listening: {
    label: "Listening...",
    bgClass: "bg-gradient-to-br from-emerald-400 to-teal-500",
    pulseColor: "rgba(16, 185, 129, 0.3)",
    icon: Mic,
  },
  processing: {
    label: "Thinking...",
    bgClass: "bg-gradient-to-br from-amber-400 to-orange-500",
    pulseColor: "rgba(245, 158, 11, 0.3)",
    icon: Loader2,
  },
  speaking: {
    label: "AI is speaking...",
    bgClass: "bg-gradient-to-br from-blue-400 to-cyan-500",
    pulseColor: "rgba(59, 130, 246, 0.3)",
    icon: Volume2,
  },
  error: {
    label: "Tap to try again",
    bgClass: "bg-gradient-to-br from-rose-400 to-red-500",
    pulseColor: "rgba(244, 63, 94, 0.3)",
    icon: MicOff,
  },
};

export function VoiceOrb({
  state,
  onClick,
  silenceProgress = 0,
}: VoiceOrbProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const isAnimating = state === "listening" || state === "speaking";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        {/* Outer pulse rings */}
        <AnimatePresence>
          {isAnimating && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.8, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: config.pulseColor }}
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                  delay: 0.5,
                }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: config.pulseColor }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Silence progress ring */}
        {state === "listening" && silenceProgress > 0 && (
          <svg
            className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)]"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${silenceProgress * 352} 352`}
              strokeLinecap="round"
              className="text-amber-400 -rotate-90 origin-center transition-all duration-100"
              transform="rotate(-90 60 60)"
            />
          </svg>
        )}

        {/* Main orb button */}
        <motion.button
          onClick={onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative w-24 h-24 rounded-full ${config.bgClass} shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-700`}
          aria-label={config.label}
        >
          <motion.div
            animate={
              state === "processing"
                ? { rotate: 360 }
                : state === "speaking"
                  ? { scale: [1, 1.1, 1] }
                  : {}
            }
            transition={
              state === "processing"
                ? { duration: 1, repeat: Infinity, ease: "linear" }
                : state === "speaking"
                  ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
                  : {}
            }
          >
            <Icon className="w-10 h-10 text-white drop-shadow-lg" />
          </motion.div>
        </motion.button>
      </div>

      {/* State label */}
      <AnimatePresence mode="wait">
        <motion.p
          key={state}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-sm font-medium text-muted-foreground"
        >
          {config.label}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
