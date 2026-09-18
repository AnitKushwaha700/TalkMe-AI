"use client";

import { useCallback, useRef, useState } from "react";

interface UseSpeechSynthesisReturn {
  isSpeaking: boolean;
  isSupported: boolean;
  speak: (text: string) => void;
  speakSentences: (sentences: string[]) => void;
  cancel: () => void;
  setRate: (rate: number) => void;
  setPitch: (pitch: number) => void;
}

export function useSpeechSynthesis(): UseSpeechSynthesisReturn {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const rateRef = useRef(0.95);
  const pitchRef = useRef(1.0);
  const queueRef = useRef<string[]>([]);
  const isCancelledRef = useRef(false);
  const isSupported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  const getPreferredVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (!isSupported) return null;
    const voices = window.speechSynthesis.getVoices();

    // Prefer high-quality English voices
    const preferred = [
      "Google UK English Female",
      "Google US English",
      "Microsoft Zira",
      "Samantha",
      "Karen",
      "Daniel",
    ];

    for (const name of preferred) {
      const voice = voices.find((v) => v.name.includes(name));
      if (voice) return voice;
    }

    // Fallback to any English voice
    return (
      voices.find((v) => v.lang.startsWith("en")) || voices[0] || null
    );
  }, [isSupported]);

  const speakSingle = useCallback(
    (text: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (!isSupported || !text.trim()) {
          resolve();
          return;
        }

        const utterance = new SpeechSynthesisUtterance(text.trim());
        const voice = getPreferredVoice();
        if (voice) utterance.voice = voice;
        utterance.rate = rateRef.current;
        utterance.pitch = pitchRef.current;
        utterance.volume = 1;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => {
          const err = event.error as string;
          if (err === "canceled" || err === "interrupted") {
            resolve(); // Expected when user barge-in
          } else {
            reject(event.error);
          }
        };

        // Chrome chunking bug workaround — Chrome stops speaking after ~15 seconds
        // Solution: keep the speech synthesis alive with periodic resume calls
        const chromeWorkaround = setInterval(() => {
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            window.speechSynthesis.resume();
          } else {
            clearInterval(chromeWorkaround);
          }
        }, 10000);

        utterance.onend = () => {
          clearInterval(chromeWorkaround);
          resolve();
        };

        window.speechSynthesis.speak(utterance);
      });
    },
    [isSupported, getPreferredVoice]
  );

  const speakSentences = useCallback(
    async (sentences: string[]) => {
      if (!isSupported) return;

      isCancelledRef.current = false;
      queueRef.current = [...sentences];
      setIsSpeaking(true);

      for (const sentence of sentences) {
        if (isCancelledRef.current) break;
        try {
          await speakSingle(sentence);
        } catch (err) {
          console.error("TTS error:", err);
          break;
        }
      }

      queueRef.current = [];
      setIsSpeaking(false);
    },
    [isSupported, speakSingle]
  );

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || !text.trim()) return;

      // Split into sentences for better TTS
      const sentences =
        text.match(/[^.!?]+[.!?]+[\s]?|[^.!?]+$/g) || [text];
      speakSentences(
        sentences.map((s) => s.trim()).filter(Boolean)
      );
    },
    [isSupported, speakSentences]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    isCancelledRef.current = true;
    queueRef.current = [];
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const setRate = useCallback((rate: number) => {
    rateRef.current = Math.min(2, Math.max(0.5, rate));
  }, []);

  const setPitch = useCallback((pitch: number) => {
    pitchRef.current = Math.min(2, Math.max(0.5, pitch));
  }, []);

  return {
    isSpeaking,
    isSupported,
    speak,
    speakSentences,
    cancel,
    setRate,
    setPitch,
  };
}
