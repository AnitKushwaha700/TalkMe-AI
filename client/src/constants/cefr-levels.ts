import type { CEFRLevel } from "@/types";

export interface CEFRLevelInfo {
  level: CEFRLevel;
  name: string;
  description: string;
  scoreRange: [number, number]; // confidence score range
}

export const CEFR_LEVELS: CEFRLevelInfo[] = [
  {
    level: "A1",
    name: "Beginner",
    description: "Can use simple phrases and sentences.",
    scoreRange: [0, 20],
  },
  {
    level: "A2",
    name: "Elementary",
    description: "Can communicate in routine tasks.",
    scoreRange: [21, 40],
  },
  {
    level: "B1",
    name: "Intermediate",
    description: "Can deal with most travel situations.",
    scoreRange: [41, 60],
  },
  {
    level: "B2",
    name: "Upper Intermediate",
    description: "Can interact with fluency and spontaneity.",
    scoreRange: [61, 75],
  },
  {
    level: "C1",
    name: "Advanced",
    description: "Can use language flexibly and effectively.",
    scoreRange: [76, 90],
  },
  {
    level: "C2",
    name: "Proficiency",
    description: "Can understand virtually everything heard or read.",
    scoreRange: [91, 100],
  },
];

export function getCEFRFromScore(score: number): CEFRLevel {
  const level = CEFR_LEVELS.find(
    (l) => score >= l.scoreRange[0] && score <= l.scoreRange[1]
  );
  return level?.level ?? "B1";
}
