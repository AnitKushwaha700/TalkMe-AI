"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Volume2,
  Gauge,
  Mic,
  Moon,
  Sun,
  Monitor,
  Languages,
  Clock,
  Info,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [voiceSpeed, setVoiceSpeed] = useState(0.95);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [silenceDelay, setSilenceDelay] = useState(1.5);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    // Load saved settings from localStorage
    const savedSpeed = localStorage.getItem("talkme_voice_speed");
    const savedPitch = localStorage.getItem("talkme_voice_pitch");
    const savedSilence = localStorage.getItem("talkme_silence_delay");

    if (savedSpeed) setVoiceSpeed(parseFloat(savedSpeed));
    if (savedPitch) setVoicePitch(parseFloat(savedPitch));
    if (savedSilence) setSilenceDelay(parseFloat(savedSilence));
  }, []);

  const saveSettings = useCallback(() => {
    localStorage.setItem("talkme_voice_speed", voiceSpeed.toString());
    localStorage.setItem("talkme_voice_pitch", voicePitch.toString());
    localStorage.setItem("talkme_silence_delay", silenceDelay.toString());
  }, [voiceSpeed, voicePitch, silenceDelay]);

  // Auto-save on change
  useEffect(() => {
    if (mounted) {
      saveSettings();
    }
  }, [voiceSpeed, voicePitch, silenceDelay, mounted, saveSettings]);

  const testVoice = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      "Hello! I am your AI English coach. Let's practice together!"
    );
    utterance.rate = voiceSpeed;
    utterance.pitch = voicePitch;

    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(
      (v) =>
        v.name.includes("Google UK English Female") ||
        v.name.includes("Google US English") ||
        v.lang.startsWith("en")
    );
    if (englishVoice) utterance.voice = englishVoice;

    window.speechSynthesis.speak(utterance);
  }, [voiceSpeed, voicePitch]);

  if (!mounted) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Customize your practice experience.
        </p>
      </div>

      {/* Voice & Audio */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-indigo-500" />
            Voice & Audio
          </CardTitle>
          <CardDescription>
            Configure AI voice output and microphone settings.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="voice-speed"
                className="flex items-center gap-2"
              >
                <Gauge className="w-4 h-4 text-muted-foreground" />
                Voice Speed
              </Label>
              <span className="text-sm font-mono text-muted-foreground">
                {voiceSpeed.toFixed(2)}x
              </span>
            </div>
            <input
              id="voice-speed"
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>Slow (0.5x)</span>
              <span>Normal (1x)</span>
              <span>Fast (2x)</span>
            </div>
          </div>

          {/* Voice Pitch */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="voice-pitch"
                className="flex items-center gap-2"
              >
                <Languages className="w-4 h-4 text-muted-foreground" />
                Voice Pitch
              </Label>
              <span className="text-sm font-mono text-muted-foreground">
                {voicePitch.toFixed(2)}
              </span>
            </div>
            <input
              id="voice-pitch"
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voicePitch}
              onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>Low (0.5)</span>
              <span>Normal (1.0)</span>
              <span>High (2.0)</span>
            </div>
          </div>

          <Button variant="outline" onClick={testVoice} className="gap-2">
            <Volume2 className="w-4 h-4" />
            Test Voice
          </Button>
        </CardContent>
      </Card>

      {/* Silence Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-emerald-500" />
            Silence Detection
          </CardTitle>
          <CardDescription>
            Control how long to wait after you stop speaking before auto-sending.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="silence-delay"
                className="flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-muted-foreground" />
                Silence Threshold
              </Label>
              <span className="text-sm font-mono text-muted-foreground">
                {silenceDelay.toFixed(1)}s
              </span>
            </div>
            <input
              id="silence-delay"
              type="range"
              min="0.5"
              max="5"
              step="0.5"
              value={silenceDelay}
              onChange={(e) =>
                setSilenceDelay(parseFloat(e.target.value))
              }
              className="w-full accent-emerald-500"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground/50">
              <span>Quick (0.5s)</span>
              <span>Normal (1.5s)</span>
              <span>Slow (5s)</span>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <p>
              A shorter threshold means the AI responds faster but might cut you
              off. A longer threshold gives you more time to think between words.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {([
              { value: "light", icon: Sun, label: "Light" },
              { value: "dark", icon: Moon, label: "Dark" },
              { value: "system", icon: Monitor, label: "System" },
            ] as const).map(({ value, icon: Icon, label }) => (
              <Button
                key={value}
                variant={theme === value ? "default" : "outline"}
                onClick={() => setTheme(value)}
                className="flex-1 gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Browser Support */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Browser Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Best experience:</strong> Google Chrome or Microsoft Edge
              (latest version)
            </p>
            <p>
              <strong>Speech recognition:</strong>{" "}
              {typeof window !== "undefined" &&
              (window.SpeechRecognition ||
                (window as unknown as Record<string, unknown>).webkitSpeechRecognition)
                ? "✅ Supported"
                : "❌ Not supported in this browser"}
            </p>
            <p>
              <strong>Speech synthesis:</strong>{" "}
              {typeof window !== "undefined" && "speechSynthesis" in window
                ? "✅ Supported"
                : "❌ Not supported in this browser"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
