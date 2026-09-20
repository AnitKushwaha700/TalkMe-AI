import { z } from "zod";

export const chatRequestSchema = z.object({
  message: z
    .string()
    .min(1, "Message is required")
    .max(500, "Message must be under 500 characters"),
  mode: z.enum([
    "free-talk",
    "interview",
    "restaurant",
    "airport",
    "office",
    "college",
    "shopping",
    "debate",
  ]),
  conversationId: z.string().optional(),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "ai"]),
        text: z.string(),
      })
    )
    .default([]),
});

export type ChatRequestInput = z.infer<typeof chatRequestSchema>;
