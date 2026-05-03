# AI English Communication Coach (Next.js + Gemini)

> **Project Goal:** Build a production-ready AI voice assistant that
> helps users improve spoken English, grammar, vocabulary,
> pronunciation, and communication confidence through natural voice
> conversations.

------------------------------------------------------------------------

# 1. Vision

Instead of creating a normal chatbot, this project will act as an **AI
English Communication Coach**.

The application should:

-   Listen to the user's voice.
-   Convert speech to text.
-   Send the conversation to Gemini AI.
-   Receive an intelligent response.
-   Speak the response back.
-   Correct grammar.
-   Suggest better vocabulary.
-   Track daily learning progress.

------------------------------------------------------------------------

# 2. Tech Stack

## Frontend

-   Next.js (App Router)
-   TypeScript
-   Tailwind CSS
-   shadcn/ui
-   Framer Motion

## Backend

-   Next.js Route Handlers (API Routes)

## Database

-   MongoDB Atlas
-   Mongoose

## Authentication

-   Better Auth (recommended)

## AI

-   Google Gemini API

## Voice

### Speech Recognition

Browser Web Speech API

### Text To Speech

Browser SpeechSynthesis API

------------------------------------------------------------------------

# 3. High Level Architecture

``` text
User
    │
    ▼
Microphone
    │
    ▼
Speech Recognition
    │
    ▼
Transcript
    │
    ▼
Next.js API Route
    │
    ▼
Gemini API
    │
    ▼
AI Response
    │
    ▼
Grammar Analysis
    │
    ▼
Database
    │
    ▼
SpeechSynthesis
    │
    ▼
AI Speaks
```

------------------------------------------------------------------------

# 4. Development Phases

## Phase 1 -- Planning

-   Project name
-   Features
-   Architecture
-   Folder structure
-   Git repository

Deliverable:

-   Complete project blueprint

------------------------------------------------------------------------

## Phase 2 -- Next.js Setup

Tasks

-   Create project
-   Configure TypeScript
-   Configure Tailwind
-   Install shadcn/ui
-   Configure ESLint

Deliverable

-   Clean starter project

------------------------------------------------------------------------

## Phase 3 -- UI Design

Pages

-   Home
-   Login
-   Register
-   Dashboard
-   Voice Practice
-   Grammar
-   Vocabulary
-   Profile
-   Settings

Deliverable

-   Responsive UI

------------------------------------------------------------------------

## Phase 4 -- Authentication

Features

-   Register
-   Login
-   Logout
-   Forgot Password
-   Protected Routes

------------------------------------------------------------------------

## Phase 5 -- Database

Collections

-   Users
-   Conversations
-   Sessions
-   Mistakes
-   Vocabulary
-   Progress
-   DailyChallenges

------------------------------------------------------------------------

## Phase 6 -- Gemini Integration

Flow

User Text

↓

Next.js API

↓

Gemini

↓

AI Response

Deliverable

-   Working AI chat

------------------------------------------------------------------------

## Phase 7 -- Voice Recognition

Features

-   Start Listening
-   Stop Listening
-   Live Transcript
-   Continuous Listening

Deliverable

-   Voice input

------------------------------------------------------------------------

## Phase 8 -- AI Voice

Use Browser SpeechSynthesis.

Deliverable

-   AI speaks responses

------------------------------------------------------------------------

## Phase 9 -- English Coach

Features

-   Grammar correction
-   Better sentence suggestion
-   Vocabulary improvement
-   Confidence feedback
-   Pronunciation tips

------------------------------------------------------------------------

## Phase 10 -- Conversation History

Store

-   User message
-   AI message
-   Time
-   Corrections

------------------------------------------------------------------------

## Phase 11 -- Progress Dashboard

Track

-   Minutes spoken
-   Grammar score
-   Vocabulary learned
-   Daily streak
-   Weekly progress

------------------------------------------------------------------------

## Phase 12 -- Practice Modes

-   Interview
-   Restaurant
-   Airport
-   Hotel
-   Office
-   Friends
-   College
-   Customer Support

------------------------------------------------------------------------

## Phase 13 -- Deployment

-   Vercel
-   MongoDB Atlas
-   Environment variables

------------------------------------------------------------------------

## Phase 14 -- PWA

Features

-   Installable
-   Offline shell
-   Mobile friendly

------------------------------------------------------------------------

# 5. Folder Structure

``` text
src
│
├── app
│   ├── (auth)
│   ├── dashboard
│   ├── practice
│   ├── voice
│   ├── profile
│   ├── settings
│   └── api
│
├── components
├── features
├── hooks
├── lib
├── services
├── store
├── context
├── utils
├── constants
├── actions
└── types
```

------------------------------------------------------------------------

# 6. MVP (Minimum Viable Product)

-   User login
-   Chat with Gemini
-   Voice input
-   AI voice output
-   Grammar correction
-   Conversation history

------------------------------------------------------------------------

# 7. Future Features

-   IELTS practice
-   TOEFL practice
-   Debate mode
-   Group discussion
-   Resume interview
-   Accent trainer
-   Image discussion
-   Daily speaking challenge
-   AI tutor memory
-   Leaderboard
-   XP system
-   Achievements

------------------------------------------------------------------------

# 8. Learning Objectives

This project teaches:

-   Next.js App Router
-   TypeScript
-   React Hooks
-   API Routes
-   Authentication
-   MongoDB
-   Mongoose
-   Gemini AI
-   Prompt Engineering
-   Browser Speech APIs
-   State Management
-   PWA
-   Deployment
-   Git & GitHub

------------------------------------------------------------------------

# 9. Milestones

  Milestone   Goal
  ----------- --------------------
  1           Project Setup
  2           Authentication
  3           Database
  4           Gemini Chat
  5           Voice Recognition
  6           AI Speech
  7           Grammar Coach
  8           Progress Dashboard
  9           PWA
  10          Deployment

------------------------------------------------------------------------

# 10. Success Criteria

The project is complete when:

-   Users can speak naturally.
-   AI responds intelligently.
-   Grammar mistakes are explained.
-   Better vocabulary is suggested.
-   Conversations are saved.
-   Progress is tracked.
-   The app is installable.
-   The application is deployed.

------------------------------------------------------------------------

# 11. Development Rules

-   Use TypeScript everywhere.
-   Keep reusable components.
-   Use feature-based architecture.
-   Commit after every milestone.
-   Never expose Gemini API keys in the client.
-   Document each completed module.

------------------------------------------------------------------------

# 12. Repository Workflow

``` text
main
│
├── feature/auth
├── feature/chat
├── feature/voice
├── feature/dashboard
├── feature/history
└── feature/pwa
```

Commit example:

``` bash
git add .
git commit -m "feat: implement voice recognition"
```

------------------------------------------------------------------------

# 13. Daily Development Plan

Week 1: - Setup - UI - Auth

Week 2: - Database - Gemini

Week 3: - Voice - AI Speech

Week 4: - Grammar Coach - Dashboard - Deployment

------------------------------------------------------------------------

# 14. Final Deliverables

-   Production-ready Next.js application
-   Responsive UI
-   AI English Coach
-   Voice Conversation
-   Grammar Assistant
-   Progress Analytics
-   Installable PWA
-   GitHub Repository
-   Deployment on Vercel
