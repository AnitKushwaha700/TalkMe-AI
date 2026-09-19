"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import type { AIResponse, ChatMessage, PracticeModeSlug } from "@/types";

interface UseChatStreamOptions {
  mode: PracticeModeSlug;
  onResponse?: (response: AIResponse) => void;
  onError?: (error: string) => void;
}

interface UseChatStreamReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  conversationId: string | null;
  sendMessage: (text: string) => Promise<AIResponse | null>;
  clearMessages: () => void;
  addAIMessage: (text: string) => void;
}

export function useChatStream(
  options: UseChatStreamOptions
): UseChatStreamReturn {
  const { mode, onResponse, onError } = options;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const conversationIdRef = useRef<string | null>(null);

  const onResponseRef = useRef(onResponse);
  const onErrorRef = useRef(onError);
  
  // Update refs in an effect to avoid the "Cannot access refs during render" error
  useEffect(() => {
    onResponseRef.current = onResponse;
    onErrorRef.current = onError;
  }, [onResponse, onError]);

  const sendMessage = useCallback(
    async (text: string): Promise<AIResponse | null> => {
      if (!text.trim() || isLoading) return null;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          text: m.text,
        }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text.trim(),
            mode,
            conversationId: conversationIdRef.current,
            history,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const aiResponse: AIResponse = await response.json();

  // Store conversation ID from response headers or generate one
        if (!conversationIdRef.current && response.headers.get("x-conversation-id")) {
          const newId = response.headers.get("x-conversation-id")!;
          conversationIdRef.current = newId;
          setConversationId(newId);
        }

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          text: aiResponse.reply,
          timestamp: new Date(),
          analysis: {
            grammarFixes: aiResponse.grammarFixes,
            betterWords: aiResponse.betterWords,
            confidenceScore: aiResponse.confidenceScore,
            cefrLevel: aiResponse.cefrLevel,
            pronunciationTip: aiResponse.pronunciationTip,
            encouragement: aiResponse.encouragement,
          },
        };

        setMessages((prev) => [...prev, aiMessage]);
        onResponseRef.current?.(aiResponse);

        return aiResponse;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Something went wrong";
        console.error("Chat error:", errorMsg);
        onErrorRef.current?.(errorMsg);

        // Add error message to chat
        const errorMessage: ChatMessage = {
          id: `error-${Date.now()}`,
          role: "ai",
          text: "Sorry, I had trouble processing that. Could you try again?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [messages, mode, isLoading]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = null;
    setConversationId(null);
  }, []);

  const addAIMessage = useCallback((text: string) => {
    const message: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: "ai",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, message]);
  }, []);



  return {
    messages,
    isLoading,
    conversationId,
    sendMessage,
    clearMessages,
    addAIMessage,
  };
}
