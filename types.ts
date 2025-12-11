
export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard'
}

export interface Question {
  topic: string;
  question: string;
  options: string[];
  correct_answer: string; // "A", "B", etc.
  difficulty: Difficulty;
  explanation: string;
}

export interface SavedQuestion extends Question {
  id: string;
  userAnswer: string | null;
  timestamp: string;
  steps?: string[]; // Optional breakdown steps
}

export interface UserStats {
  totalQuestions: number;
  correct: number;
  topicBreakdown: Record<string, {
    total: number;
    correct: number;
    timeSpent: number; // in seconds
  }>;
  difficultyStats: Record<Difficulty, {
    total: number;
    correct: number;
  }>;
  history: SessionResult[];
}

export interface SessionResult {
  date: string;
  topic: string;
  score: number;
  total: number;
  averageTime: number;
  mode: 'Standard' | 'Math';
}

export interface StudyPlan {
  examDate: string | null; // ISO Date string
  targetQuestions: number;
  startDate: string;
}

export enum AppView {
  HOME = 'HOME',
  QUIZ = 'QUIZ',
  REPORT = 'REPORT',
  DASHBOARD = 'DASHBOARD',
  STUDY = 'STUDY',
  SPEED_MATH = 'SPEED_MATH',
  REVIEW = 'REVIEW',
  PLANNER = 'PLANNER',
  CAPACITY = 'CAPACITY'
}

export interface StudySection {
  title: string;
  content: string; // Supports basic markdown-like headers/lists
  examples?: {
    question: string;
    answer: string;
    explanation: string;
  }[];
}

export interface StudyCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: StudySection[];
}
