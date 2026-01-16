// types/settings.ts

export type Language = 'ru' | 'en' | 'ko';
export type Theme = 'light' | 'dark' | 'auto';

export interface AppSettings {
  // Языки
  interfaceLanguage: Language;
  learningLanguage: Language;
  
  // Обучение
  dailyGoal: number; // слов в день
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
  
  // UI
  theme: Theme;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  
  // Прочее
  showRomanization: boolean;
    soundTheme: 'classic' | 'gaming';  // ⬅️ ДОБАВИЛИ
    questionsPerRound: number;  

}