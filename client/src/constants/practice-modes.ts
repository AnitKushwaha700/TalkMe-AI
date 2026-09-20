import type { PracticeMode } from "@/types";

export const PRACTICE_MODES: PracticeMode[] = [
  {
    slug: "free-talk",
    title: "Free Talk",
    description: "Kuch bhi baat karo — talk about anything you like!",
    aiPersona: "Friendly friend",
    openingPrompt:
      "Hey! What's on your mind today? Let's just chat about anything you want!",
    icon: "MessageCircle",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    slug: "interview",
    title: "Job Interview",
    description: "Practice answering common interview questions confidently.",
    aiPersona: "Professional HR Manager",
    openingPrompt:
      "Good morning! Thank you for coming in today. Let's start — can you tell me a little about yourself?",
    icon: "Briefcase",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    slug: "restaurant",
    title: "Restaurant",
    description: "Order food and handle restaurant conversations naturally.",
    aiPersona: "Friendly waiter at a restaurant",
    openingPrompt:
      "Welcome to The Grand Kitchen! Here's the menu. What would you like to order today?",
    icon: "UtensilsCrossed",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
    gradient: "from-orange-500 to-red-500",
  },
  {
    slug: "airport",
    title: "Airport",
    description: "Navigate check-in, security, and boarding like a pro.",
    aiPersona: "Airport check-in staff",
    openingPrompt:
      "Good afternoon! Welcome to the airline counter. May I see your passport and booking confirmation, please?",
    icon: "Plane",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    slug: "office",
    title: "Office",
    description: "Handle workplace conversations, meetings, and emails.",
    aiPersona: "Friendly office colleague",
    openingPrompt:
      "Hey! Did you see the email about the team meeting at 3? What do you think about the new project?",
    icon: "Building2",
    color:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    slug: "college",
    title: "College",
    description: "Chat with classmates about lectures, exams, and campus life.",
    aiPersona: "College classmate",
    openingPrompt:
      "Hey! Did you understand today's lecture? I was so confused about the last part. Can you explain?",
    icon: "GraduationCap",
    color:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    gradient: "from-amber-500 to-yellow-500",
  },
  {
    slug: "shopping",
    title: "Shopping",
    description: "Bargain, ask for sizes, and handle shopping conversations.",
    aiPersona: "Helpful shopkeeper",
    openingPrompt:
      "Welcome! We have some great new arrivals today. What are you looking for? How can I help you?",
    icon: "ShoppingBag",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    slug: "debate",
    title: "Debate",
    description: "Argue your point, defend positions, and think critically.",
    aiPersona: "Debate opponent who respectfully disagrees",
    openingPrompt:
      "Let's have a friendly debate! I'll take the opposite side of whatever you argue. Pick a topic and state your position!",
    icon: "Swords",
    color: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    gradient: "from-red-500 to-rose-600",
  },
];

export function getPracticeModeBySlug(
  slug: string
): PracticeMode | undefined {
  return PRACTICE_MODES.find((m) => m.slug === slug);
}
