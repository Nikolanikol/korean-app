import { Word } from './vocabulary';

export type ExerciseType = 'multiple-choice' | 'typing' | 'listening' | 'matching';

export interface MultipleChoiceQuestion {
  word: Word;
  correctAnswer: string;
  options: string[];
  questionType: 'korean-to-russian' | 'russian-to-korean';
}

export interface ExerciseSession {
  vocabularyId: string;
  exerciseType: ExerciseType;
  questions: MultipleChoiceQuestion[];
  currentIndex: number;
  correctCount: number;
  incorrectCount: number;
  startedAt: string;
  completedAt?: string;
}

export interface ExerciseResult {
  wordId: string;
  wasCorrect: boolean;
  timeSpent: number; // секунды
}