import { initializeMockProgress } from '@/mocks/progress.mock';
import { DailyActivity, WordProgress } from '@/types/progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ProgressStore {
  // Активность по дням
  dailyActivity: DailyActivity[];
  currentStreak: number;
  longestStreak: number;
  
  // Прогресс по словам
  wordProgress: WordProgress[];
  totalWordsLearned: number;
  
  // Actions
  recordActivity: (wordsStudied: number, correct: number, total: number) => void;
  updateWordProgress: (wordId: string, vocabularyId: string, wasCorrect: boolean) => void;
  getWeekActivity: () => DailyActivity[];
  calculateStreak: () => void;
  // ⬇️ НОВЫЕ ФУНКЦИИ ДЛЯ SRS
  getDueWords: (vocabularyId?: string) => WordProgress[];
  getNewWords: (vocabularyId: string, allWords: any[], limit: number) => any[];
  calculateNextReview: (level: number, wasCorrect: boolean) => string;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => {
      const mockData = initializeMockProgress();
      
      return {
        dailyActivity: mockData.dailyActivity,
        currentStreak: mockData.currentStreak,
        longestStreak: mockData.longestStreak,
        wordProgress: mockData.wordProgress,
        totalWordsLearned: mockData.totalWordsLearned,

        recordActivity: (wordsStudied, correct, total) => {
          const today = new Date().toISOString().split('T')[0];
          const { dailyActivity } = get();
          
          const existingIndex = dailyActivity.findIndex(a => a.date === today);
          
          if (existingIndex >= 0) {
            // Обновляем сегодняшнюю активность
            const updated = [...dailyActivity];
            updated[existingIndex] = {
              ...updated[existingIndex],
              wordsStudied: updated[existingIndex].wordsStudied + wordsStudied,
              sessionsCompleted: updated[existingIndex].sessionsCompleted + 1,
              correctAnswers: updated[existingIndex].correctAnswers + correct,
              totalAnswers: updated[existingIndex].totalAnswers + total,
            };
            set({ dailyActivity: updated });
          } else {
            // Создаем новую запись
            set({
              dailyActivity: [
                ...dailyActivity,
                {
                  date: today,
                  wordsStudied,
                  sessionsCompleted: 1,
                  correctAnswers: correct,
                  totalAnswers: total,
                },
              ],
            });
          }
          
          get().calculateStreak();
        },

        updateWordProgress: (wordId, vocabularyId, wasCorrect) => {
          const { wordProgress } = get();
          const existingIndex = wordProgress.findIndex(w => w.wordId === wordId);
          
          if (existingIndex >= 0) {
            // Обновляем существующий прогресс
            const updated = [...wordProgress];
            const word = updated[existingIndex];
            
            updated[existingIndex] = {
              ...word,
              correctCount: wasCorrect ? word.correctCount + 1 : word.correctCount,
              incorrectCount: wasCorrect ? word.incorrectCount : word.incorrectCount + 1,
              level: wasCorrect ? Math.min(word.level + 1, 5) : Math.max(word.level - 1, 0),
              lastReviewed: new Date().toISOString(),
nextReview: get().calculateNextReview(wasCorrect ? Math.min(word.level + 1, 5) : Math.max(word.level - 1, 0), wasCorrect),
            };
            
            set({ wordProgress: updated });
          } else {
            // Создаем новый прогресс
            set({
              wordProgress: [
                ...wordProgress,
                {
                  wordId,
                  vocabularyId,
                  level: wasCorrect ? 1 : 0,
                  correctCount: wasCorrect ? 1 : 0,
                  incorrectCount: wasCorrect ? 0 : 1,
                  lastReviewed: new Date().toISOString(),
                  nextReview: get().calculateNextReview(wasCorrect ? 1 : 0, wasCorrect),

                },
              ],
            });
          }
          
          // Подсчитываем слова с level >= 3 как "выученные"
          const learned = get().wordProgress.filter(w => w.level >= 3).length;
          set({ totalWordsLearned: learned });
        },

        getWeekActivity: () => {
          const { dailyActivity } = get();
          const today = new Date();
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 6); // последние 7 дней
          
          const weekDates = [];
          for (let i = 0; i < 7; i++) {
            const date = new Date(weekAgo);
            date.setDate(date.getDate() + i);
            weekDates.push(date.toISOString().split('T')[0]);
          }
          
          return weekDates.map(date => {
            const activity = dailyActivity.find(a => a.date === date);
            return activity || {
              date,
              wordsStudied: 0,
              sessionsCompleted: 0,
              correctAnswers: 0,
              totalAnswers: 0,
            };
          });
        },

        calculateStreak: () => {
          const { dailyActivity } = get();
          if (dailyActivity.length === 0) {
            set({ currentStreak: 0, longestStreak: 0 });
            return;
          }
          
          // Сортируем по дате (новые первые)
          const sorted = [...dailyActivity].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          
          let currentStreak = 0;
          let longestStreak = 0;
          let tempStreak = 0;
          
          const today = new Date().toISOString().split('T')[0];
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          // Проверяем текущий streak
          if (sorted[0].date === today || sorted[0].date === yesterdayStr) {
            currentStreak = 1;
            let checkDate = new Date(sorted[0].date);
            
            for (let i = 1; i < sorted.length; i++) {
              checkDate.setDate(checkDate.getDate() - 1);
              const expectedDate = checkDate.toISOString().split('T')[0];
              
              if (sorted[i].date === expectedDate) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
          
          // Считаем самый длинный streak
          tempStreak = 1;
          for (let i = 1; i < sorted.length; i++) {
            const prevDate = new Date(sorted[i - 1].date);
            prevDate.setDate(prevDate.getDate() - 1);
            const expectedDate = prevDate.toISOString().split('T')[0];
            
            if (sorted[i].date === expectedDate) {
              tempStreak++;
              longestStreak = Math.max(longestStreak, tempStreak);
            } else {
              tempStreak = 1;
            }
          }
          
          longestStreak = Math.max(longestStreak, currentStreak);
          
          set({ currentStreak, longestStreak });
        },
           getDueWords: (vocabularyId?: string) => {
          const { wordProgress } = get();
          const now = new Date();
          
          let dueWords = wordProgress.filter(wp => 
            new Date(wp.nextReview) <= now
          );
          
          // Фильтр по словарю если указан
          if (vocabularyId) {
            dueWords = dueWords.filter(wp => wp.vocabularyId === vocabularyId);
          }
          
          // Сортировка по приоритету (новые/забытые первыми)
          return dueWords.sort((a, b) => {
            // Сначала level 0-1 (забытые/новые)
            if (a.level !== b.level) {
              return a.level - b.level;
            }
            // Потом по дате следующего повторения
            return new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime();
          });
        },

        getNewWords: (vocabularyId, allWords, limit) => {
          const { wordProgress } = get();
          
          // Находим слова которые еще не в прогрессе
          const studiedWordIds = new Set(
            wordProgress
              .filter(wp => wp.vocabularyId === vocabularyId)
              .map(wp => wp.wordId)
          );
          
          const newWords = allWords.filter(word => !studiedWordIds.has(word.id));
          
          return newWords.slice(0, limit);
        },

        calculateNextReview: (level, wasCorrect) => {
          const now = new Date();
          
          if (!wasCorrect) {
            // При ошибке - показать через 10 минут
            return new Date(now.getTime() + 10 * 60 * 1000).toISOString();
          }
          
          // Интервалы для каждого уровня (в миллисекундах)
          const intervals = {
            0: 10 * 60 * 1000,        // 10 минут
            1: 1 * 24 * 60 * 60 * 1000,    // 1 день
            2: 3 * 24 * 60 * 60 * 1000,    // 3 дня
            3: 7 * 24 * 60 * 60 * 1000,    // 7 дней
            4: 14 * 24 * 60 * 60 * 1000,   // 14 дней
            5: 30 * 24 * 60 * 60 * 1000,   // 30 дней
          };
          
          const interval = intervals[level as keyof typeof intervals] || intervals[0];
          return new Date(now.getTime() + interval).toISOString();
        },
      };
    },
    {
      name: 'progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);