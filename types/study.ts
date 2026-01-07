import { StudyMode, Word, WordStatus } from "./vocabulary";

export interface WordProgress {
  userId: string;
  wordId: string;
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewDate: string;
  status: WordStatus;
  correctCount: number;
  incorrectCount: number;
  totalReviews: number;
  lastReviewedAt?: string;
  firstLearnedAt: string;
  masteredAt?: string;
}

export interface StudySession {
  id: string;
  userId: string;
  vocabularyId: string;
  studyMode: StudyMode;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  durationSeconds: number;
  startedAt: string;
  completedAt?: string;
}

export interface StudyCard {
  word: Word;
  progress?: WordProgress;
}
