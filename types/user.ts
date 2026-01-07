export interface User {
  id: string;
  email: string;
  username?: string;
  nativeLanguage: string;
  learningLanguage: string;
  subscriptionTier: 'free' | 'pro' | 'unlimited';
  subscriptionExpiresAt?: string;
  streakDays: number;
  totalWordsLearned: number;
  lastActivityDate?: string;
  createdAt: string;
}

export interface UserStats {
  totalVocabularies: number;
  totalWords: number;
  wordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  totalStudyTime: number;
  studySessionsCount: number;
}

