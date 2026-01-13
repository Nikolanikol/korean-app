import { DailyActivity, WordProgress } from '@/types/progress';

// Генерируем активность за последние 7 дней
export const generateMockWeekActivity = (): DailyActivity[] => {
  const activities: DailyActivity[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Генерируем случайную активность (реалистично)
    // Выходные - меньше активности
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let wordsStudied = 0;
    let sessionsCompleted = 0;
    let correctAnswers = 0;
    let totalAnswers = 0;
    
    // 80% вероятность что учил в этот день
    if (Math.random() > 0.2) {
      wordsStudied = isWeekend 
        ? Math.floor(Math.random() * 10) + 5  // 5-15 слов в выходные
        : Math.floor(Math.random() * 20) + 10; // 10-30 слов в будни
      
      sessionsCompleted = Math.floor(Math.random() * 3) + 1; // 1-3 сессии
      
      totalAnswers = wordsStudied * 3; // примерно 3 повторения на слово
      correctAnswers = Math.floor(totalAnswers * (0.7 + Math.random() * 0.25)); // 70-95% правильных
    }
    
    activities.push({
      date: dateStr,
      wordsStudied,
      sessionsCompleted,
      correctAnswers,
      totalAnswers,
    });
  }
  
  return activities;
};

// Мок данные для прогресса слов (из существующих словарей)
export const mockWordProgress: WordProgress[] = [
  {
    wordId: 'word-1',
    vocabularyId: 'vocab-1',
    level: 4,
    correctCount: 8,
    incorrectCount: 2,
    lastReviewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    wordId: 'word-2',
    vocabularyId: 'vocab-1',
    level: 3,
    correctCount: 5,
    incorrectCount: 1,
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    wordId: 'word-3',
    vocabularyId: 'vocab-1',
    level: 5,
    correctCount: 12,
    incorrectCount: 1,
    lastReviewed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    wordId: 'word-4',
    vocabularyId: 'vocab-2',
    level: 2,
    correctCount: 3,
    incorrectCount: 2,
    lastReviewed: new Date().toISOString(),
    nextReview: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    wordId: 'word-5',
    vocabularyId: 'vocab-2',
    level: 4,
    correctCount: 7,
    incorrectCount: 0,
    lastReviewed: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Функция для инициализации прогресса с моками
export const initializeMockProgress = () => {
  return {
    dailyActivity: generateMockWeekActivity(),
    wordProgress: mockWordProgress,
    currentStreak: 5, // 5 дней подряд
    longestStreak: 12, // рекорд - 12 дней
    totalWordsLearned: mockWordProgress.filter(w => w.level >= 3).length,
  };
};