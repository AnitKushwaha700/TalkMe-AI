# 🎙️ TalkMe-AI — Master Plan

> **Tagline:** *"Bolo English, Seekho English — bilkul free."*
> **Vision:** Duniya ka sabse accessible, free AI English speaking coach.

---

## 📌 1. Project Overview

| Item | Details |
|------|---------|
| **Name** | TalkMe-AI |
| **Type** | AI-powered English communication coach |
| **Target Users** | English learners (India + global) |
| **Cost** | 100% Free for users |
| **Platform** | Web (PWA) — Chrome-first |
| **Hosting** | Vercel (free) |
| **Status** | Planning → Development |

---

## 🎯 2. Core Principles

- ✅ **Free Forever** — No paywall, no signup wall
- ✅ **Zero Friction** — Anonymous session, straight practice
- ✅ **Real-Time** — Streaming responses, no wait
- ✅ **Natural** — Human-like conversation, barge-in support
- ✅ **Chrome-First** — Best on Chrome/Edge, fallback elsewhere
- ✅ **Mobile-Friendly** — PWA, installable, offline shell

---

## 🧩 3. Feature Roadmap

### 🟢 MVP (Launch)
- [ ] Text + Voice chat with AI
- [ ] Live transcript (interim results)
- [ ] Silence detection → auto send
- [ ] AI voice output (streaming, sentence-by-sentence)
- [ ] Grammar correction (inline)
- [ ] Better vocabulary suggestions
- [ ] Confidence score per message
- [ ] Conversation history
- [ ] Anonymous cookie session
- [ ] 8 practice modes
- [ ] Daily streak + minutes tracked
- [ ] Mobile responsive + PWA

### 🟡 Phase 2 (Post-Launch)
- [ ] User accounts (email/Google)
- [ ] Pronunciation tips
- [ ] Word bank
- [ ] Daily challenges
- [ ] XP + Achievements
- [ ] Progress charts
- [ ] Voice picker

### 🔵 Phase 3 (Future)
- [ ] IELTS / TOEFL practice
- [ ] Debate mode
- [ ] Group discussion
- [ ] Resume interview
- [ ] Accent trainer
- [ ] AI tutor memory (Vector DB)
- [ ] Leaderboard

---

## 🏗️ 4. Architecture

```
CLIENT (Chrome/Edge)
  🎤 Mic → Web Speech API → Live Transcript
  ↓ (1.5s silence)
  📝 POST /api/chat (streaming)
  ↓
  🔊 Response → SpeechSynthesis (per sentence)
  ↓
  🛑 User speaks → AI stops (barge-in)
        ↓
NEXT.JS API ROUTES (Vercel)
  /api/chat       → Gemini streaming + JSON parse
  /api/session    → Anonymous cookie session
  /api/history    → Conversation list
  /api/progress   → Streak, minutes, scores
        ↓
  ┌────────────┬──────────────┬──────────────┐
  │ Gemini API │ MongoDB Atlas│ Upstash Redis│
  │ 1500/day   │ 512MB free   │ 10K cmd/day  │
  └────────────┴──────────────┴──────────────┘
        ↓
  🚀 Vercel Deploy
```

---

## 🗂️ 5. Folder Structure

```
talkme-ai/
├── src/
│   ├── app/
│   │   ├── (marketing)/
│   │   │   ├── page.tsx              # Landing
│   │   │   └── about/page.tsx
│   │   ├── (app)/
│   │   │   ├── layout.tsx
│   │   │   ├── practice/
│   │   │   │   ├── page.tsx          # Mode selector
│   │   │   │   └── [mode]/page.tsx   # Voice chat
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── history/page.tsx
│   │   │   ├── grammar/page.tsx
│   │   │   ├── vocabulary/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── chat/route.ts
│   │   │   ├── session/route.ts
│   │   │   ├── history/route.ts
│   │   │   └── progress/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── features/
│   │   ├── voice/
│   │   │   ├── hooks/
│   │   │   │   ├── useSpeechRecognition.ts
│   │   │   │   ├── useSpeechSynthesis.ts
│   │   │   │   └── useSilenceDetector.ts
│   │   │   ├── components/
│   │   │   │   ├── VoiceOrb.tsx
│   │   │   │   ├── LiveTranscript.tsx
│   │   │   │   └── Waveform.tsx
│   │   │   └── types.ts
│   │   ├── coach/
│   │   │   ├── prompts/
│   │   │   │   ├── system.ts
│   │   │   │   └── modes.ts
│   │   │   ├── services/gemini.ts
│   │   │   ├── schemas/response.ts
│   │   │   └── parsers/streamParser.ts
│   │   ├── chat/
│   │   │   ├── components/
│   │   │   │   ├── ChatBubble.tsx
│   │   │   │   ├── FeedbackPanel.tsx
│   │   │   │   └── TypingIndicator.tsx
│   │   │   └── hooks/useChatStream.ts
│   │   ├── progress/
│   │   │   ├── components/
│   │   │   │   ├── StreakCard.tsx
│   │   │   │   ├── MinutesChart.tsx
│   │   │   │   └── ScoreTrend.tsx
│   │   │   └── hooks/useProgress.ts
│   │   └── session/hooks/useSession.ts
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Sidebar.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── lib/
│   │   ├── db.ts
│   │   ├── redis.ts
│   │   ├── rate-limit.ts
│   │   ├── session.ts
│   │   └── utils.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Conversation.ts
│   │   ├── Message.ts
│   │   ├── Mistake.ts
│   │   └── Progress.ts
│   │
│   ├── constants/
│   │   ├── practice-modes.ts
│   │   ├── cefr-levels.ts
│   │   └── voices.ts
│   │
│   └── types/index.ts
│
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── og-image.png
│
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🧠 6. Core Flow

### Voice Input
```
🎤 Click mic
  ↓
useSpeechRecognition.start()
  ↓
interimResults = true, continuous = true
  ↓
Live transcript (typing effect)
  ↓
Silence 1.5s → auto-send
```

### AI Response (Streaming)
```
POST /api/chat
  ↓
1. Rate limit check
2. Get/create session
3. Build prompt
4. Gemini generateContentStream
  ↓
Stream chunks → sentence splitter → speak each
  ↓
Parse full JSON at end → update feedback panel
```

### Barge-In
```typescript
recognition.onresult = (event) => {
  if (speechSynthesis.speaking && transcript.length > 3) {
    speechSynthesis.cancel();
  }
};
```

---

## 📊 7. AI Response Schema

```json
{
  "reply": "That's a great start! Tell me more.",
  "grammarFixes": [
    {
      "wrong": "I go to office yesterday",
      "right": "I went to the office yesterday",
      "why": "Past event → past tense",
      "severity": "medium"
    }
  ],
  "betterWords": [
    {
      "youSaid": "good",
      "better": "fantastic",
      "example": "I had a fantastic day."
    }
  ],
  "pronunciationTip": "Focus on 'th' sound",
  "confidenceScore": 72,
  "cefrLevel": "B1",
  "encouragement": "Your fluency is improving!"
}
```

---

## 🎭 8. Practice Modes

| Mode | AI Persona | Prompt |
|------|-----------|--------|
| Free Talk | Friendly friend | "Kuch bhi baat karo" |
| Interview | HR manager | "Tell me about yourself" |
| Restaurant | Waiter | "What would you like?" |
| Airport | Check-in staff | "May I see your passport?" |
| Office | Colleague | "Join the meeting at 3?" |
| College | Classmate | "Did you understand?" |
| Shopping | Shopkeeper | "How can I help?" |
| Debate | Opponent | "I disagree — explain" |

---

## 🗄️ 9. Database Schema

```typescript
// User
{
  _id, sessionId,
  email?, name?,
  level: 'A1'|'A2'|'B1'|'B2'|'C1'|'C2',
  streak, totalMinutes, xp,
  createdAt, lastActiveAt
}

// Conversation
{
  _id, userId, mode,
  startedAt, endedAt, duration,
  messageCount, avgConfidence
}

// Message
{
  _id, conversationId, role: 'user'|'ai',
  text, audioDuration?,
  analysis: {
    grammarFixes[], betterWords[],
    confidenceScore, cefrLevel
  },
  createdAt
}

// Mistake
{
  _id, userId, type,
  wrong, right, why,
  occurrences, lastSeen
}

// Progress
{
  _id, userId, date,
  minutes, messages, grammarScore,
  newWords, streakMaintained
}
```

---

## 📅 10. 6-Week Execution Plan

### Week 1 — Foundation & Text Chat
- [ ] Day 1: Setup Next.js + Tailwind + shadcn
- [ ] Day 2: MongoDB Atlas + lib/db.ts
- [ ] Day 3: Anonymous session
- [ ] Day 4: Gemini client + /api/chat
- [ ] Day 5: Practice page UI (text)
- [ ] Day 6: Save to DB + history API
- [ ] Day 7: Test + commit
- **✅ Milestone:** Text MVP

### Week 2 — Voice Input
- [ ] Day 8: useSpeechRecognition
- [ ] Day 9: Live transcript UI
- [ ] Day 10: useSilenceDetector
- [ ] Day 11: VoiceOrb component
- [ ] Day 12: Wire mic → chat
- [ ] Day 13: Browser fallbacks
- [ ] Day 14: Mobile testing
- **✅ Milestone:** Voice input

### Week 3 — AI Voice + Streaming
- [ ] Day 15: useSpeechSynthesis
- [ ] Day 16: Voice picker
- [ ] Day 17: Gemini streaming
- [ ] Day 18: Sentence parser
- [ ] Day 19: Barge-in
- [ ] Day 20: Chrome chunking fix
- [ ] Day 21: Full loop test
- **✅ Milestone:** Voice chat

### Week 4 — English Coach
- [ ] Day 22: Structured prompt
- [ ] Day 23: Zod schema
- [ ] Day 24: FeedbackPanel UI
- [ ] Day 25: Mistake aggregation
- [ ] Day 26: 8 practice modes
- [ ] Day 27: Confidence + CEFR
- [ ] Day 28: Polish
- **✅ Milestone:** Coach ready

### Week 5 — Progress & History
- [ ] Day 29: History page
- [ ] Day 30: Replay conversation
- [ ] Day 31: Dashboard streak
- [ ] Day 32: Progress charts
- [ ] Day 33: Grammar review
- [ ] Day 34: Word bank
- [ ] Day 35: Daily challenges
- **✅ Milestone:** Retention

### Week 6 — PWA & Deploy
- [ ] Day 36: next-pwa setup
- [ ] Day 37: Manifest + icons
- [ ] Day 38: Rate limiting
- [ ] Day 39: Error boundaries
- [ ] Day 40: SEO + landing
- [ ] Day 41: Vercel deploy
- [ ] Day 42: Launch! 🚀
- **✅ Milestone:** LIVE

---

## 💰 11. Cost & Limits

| Service | Free Limit | Supports |
|---------|-----------|----------|
| Vercel | 100GB/mo | ~10K users |
| MongoDB Atlas | 512MB | ~100K chats |
| Gemini API | 1500/day | ~100 users/day |
| Upstash Redis | 10K cmd/day | Rate limit |
| Web Speech API | Free | Unlimited |
| SpeechSynthesis | Free | Unlimited |
| **Total** | **₹0/month** | Until 100+ daily |

**Scaling:**
1. Rate limit 20 msg/user/day
2. Gemini key rotation
3. Response caching
4. Paid tier when needed

---

## 🎨 12. UI/UX

### Practice Screen
```
┌─────────────────────────────────────┐
│ [Interview] [B1]           [⚙️]     │
├─────────────────────────────────────┤
│                                     │
│          🔵 🔵 🔵                   │
│         (Voice Orb)                 │
│        [Tap to speak]               │
│                                     │
│  ── Live Transcript ──              │
│  "I am going to office..."          │
├─────────────────────────────────────┤
│  💬 Chat History                    │
├─────────────────────────────────────┤
│  📝 Feedback                        │
│  ❌ "I go" → ✅ "I went"            │
│  💡 "good" → "fantastic"            │
│  📊 Confidence: 72%                 │
└─────────────────────────────────────┘
```

### Colors
- Primary: `#6366F1` (Indigo)
- Success: `#10B981` (Emerald)
- Error: `#F43F5E` (Rose)
- Streak: `#F59E0B` (Amber)

---

## 🔐 13. Security

- [ ] Gemini key only in API route
- [ ] .env.local in .gitignore
- [ ] Rate limiting per session
- [ ] Zod input validation
- [ ] Transcript length limit (500 chars)
- [ ] HTTPS only
- [ ] CSP headers
- [ ] No PII without consent

---

## 📊 14. Success Metrics

| Metric | Month 1 Target |
|--------|---------------|
| Unique users | 500+ |
| Avg session | 5+ min |
| Returning users | 20% |
| Conversations/user | 3+ |
| PWA installs | 100+ |
| Cost | ₹0 |

---

## 🛠️ 15. Tech Stack

```yaml
Frontend:
  - Next.js 15 (App Router)
  - TypeScript
  - Tailwind CSS
  - shadcn/ui
  - Framer Motion
  - Recharts

Backend:
  - Next.js Route Handlers
  - Zod

Database:
  - MongoDB Atlas + Mongoose

Rate Limiting:
  - Upstash Redis

AI:
  - Google Gemini (gemini-1.5-flash)

Voice:
  - Web Speech API (input)
  - SpeechSynthesis API (output)

PWA:
  - next-pwa

Hosting:
  - Vercel
```

---

## ✅ 16. MVP Checklist

- [ ] Chrome pe mic works
- [ ] Live transcript visible
- [ ] 1.5s silence → auto respond
- [ ] AI speaks sentence-by-sentence
- [ ] Barge-in works
- [ ] Grammar mistakes shown
- [ ] Better words suggested
- [ ] 8 practice modes
- [ ] Conversation saved
- [ ] Dashboard streak + minutes
- [ ] Landing page
- [ ] Vercel deployed
- [ ] PWA installable
- [ ] Free for everyone

---

## 🚀 17. Launch Plan

**Day 42:**
1. Deploy to Vercel
2. Custom domain (optional)
3. Post on:
   - Twitter/X
   - LinkedIn
   - Reddit (r/EnglishLearning)
   - Product Hunt
4. Monitor Gemini usage
5. Collect feedback
6. Weekly updates

---

## 📝 18. Development Rules

1. TypeScript everywhere — no `any`
2. Feature-based folders
3. Commit daily: `feat:`, `fix:`, `docs:`
4. Test on real phone every 2 days
5. Chrome first
6. Prompt tuning = 2 full days
7. Never expose keys
8. Ship weekly — done > perfect

---

## 🎬 19. Immediate Next Steps

**Aaj:**
```bash
npx create-next-app@latest talkme-ai --typescript --tailwind --app
cd talkme-ai
npx shadcn@latest init
npm install @google/generative-ai mongoose zod framer-motion recharts
```

**Kal:**
- MongoDB Atlas free cluster
- Gemini API key
- .env.local setup
- lib/db.ts + lib/session.ts

**Is hafte:**
- Text chat MVP
- GitHub repo public
- First commit

---

## 🔮 20. Post-Launch Roadmap

**Month 2:**
- User accounts
- Pronunciation feedback
- Daily challenges + XP

**Month 3:**
- IELTS/TOEFL modes
- Word bank + flashcards
- Mobile app (TWA)

**Month 4+:**
- Group discussion rooms
- Leaderboard
- AI tutor memory
- Accent trainer

---

**Last Updated:** _[Yeh date daal do jab update karo]_
**Maintainer:** _[Tumhara naam]_
**License:** MIT (free for everyone)

---

> 💡 **Mantra:** *"Bolo, galti karo, seekho — TalkMe-AI tumhare saath hai."*