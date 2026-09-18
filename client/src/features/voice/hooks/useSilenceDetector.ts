"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSilenceDetectorOptions {
  silenceThresholdMs?: number; // How long silence before triggering
  onSilenceDetected?: () => void;
  enabled?: boolean;
}

interface UseSilenceDetectorReturn {
  isSilent: boolean;
  timeSinceLastSpeech: number;
  reset: () => void;
}

export function useSilenceDetector(
  options: UseSilenceDetectorOptions = {}
): UseSilenceDetectorReturn {
  const {
    silenceThresholdMs = 1500,
    onSilenceDetected,
    enabled = false,
  } = options;

  const [isSilent, setIsSilent] = useState(false);
  const [timeSinceLastSpeech, setTimeSinceLastSpeech] = useState(0);

  const lastSpeechTimeRef = useRef<number>(0);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(onSilenceDetected);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    lastSpeechTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    callbackRef.current = onSilenceDetected;
  }, [onSilenceDetected]);

  // Reset the silence timer (call this when speech is detected)
  const reset = useCallback(() => {
    lastSpeechTimeRef.current = Date.now();
    hasFiredRef.current = false;
    setIsSilent(false);
    setTimeSinceLastSpeech(0);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      // Clean up timers when disabled
      // Only clean up timers, avoid state updates in effect cleanup
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    // Reset on enable
    lastSpeechTimeRef.current = Date.now();
    hasFiredRef.current = false;

    // Check silence periodically
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - lastSpeechTimeRef.current;
      setTimeSinceLastSpeech(elapsed);

      if (elapsed >= silenceThresholdMs && !hasFiredRef.current) {
        setIsSilent(true);
        hasFiredRef.current = true;
        callbackRef.current?.();
      }
    }, 100);

    return () => {
      const silenceTimer = silenceTimerRef.current;
      const interval = intervalRef.current;
      if (silenceTimer) clearTimeout(silenceTimer);
      if (interval) clearInterval(interval);
    };
  }, [enabled, silenceThresholdMs]);

  return {
    isSilent,
    timeSinceLastSpeech,
    reset,
  };
}
