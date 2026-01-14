// types/progress.ts

// Активность по дням
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  wordsStudied: number;
  sessionsCompleted: number;
  correctAnswers: number;
  totalAnswers: number;
}

// Прогресс по отдельному слову
export interface WordProgress {
  wordId: string;
  vocabularyId: string;
  level: number; // 0-5 (SRS уровень)
  correctCount: number;
  incorrectCount: number;
  lastReviewed: string; // ISO date
  nextReview: string; // ISO date
  
}

// Статистика streak
export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}