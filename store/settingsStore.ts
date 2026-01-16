import { AppSettings, Language } from '@/types/settings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsStore {
  settings: AppSettings;
  
  // Actions
  updateSettings: (updates: Partial<AppSettings>) => void;
  setDailyGoal: (goal: number) => void;
  setInterfaceLanguage: (lang: Language) => void;
  setLearningLanguage: (lang: Language) => void;
  toggleSound: () => void;
  toggleHaptics: () => void;
  toggleRomanization: () => void;
    setSoundTheme: (theme: 'classic' | 'gaming') => void;  // ⬅️ ДОБАВИЛИ

  resetSettings: () => void;
  setQuestionsPerRound: (count: number) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  interfaceLanguage: 'ru',
  learningLanguage: 'ko',
  dailyGoal: 20,
  reminderEnabled: true,
  reminderTime: '20:00',
  theme: 'light',
  soundEnabled: true,
  hapticsEnabled: true,
  showRomanization: true,
    soundTheme: 'classic',  // ⬅️ ДОБАВИЛИ (по умолчанию классические)
    questionsPerRound: 10,

  
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_SETTINGS,

      updateSettings: (updates) => {
        set(state => ({
          settings: { ...state.settings, ...updates }
        }));
      },

      setDailyGoal: (goal) => {
        set(state => ({
          settings: { ...state.settings, dailyGoal: goal }
        }));
      },

      setInterfaceLanguage: (lang) => {
        set(state => ({
          settings: { ...state.settings, interfaceLanguage: lang }
        }));
      },

      setLearningLanguage: (lang) => {
        set(state => ({
          settings: { ...state.settings, learningLanguage: lang }
        }));
      },

      toggleSound: () => {
        set(state => ({
          settings: { 
            ...state.settings, 
            soundEnabled: !state.settings.soundEnabled 
          }
        }));
      },

      toggleHaptics: () => {
        set(state => ({
          settings: { 
            ...state.settings, 
            hapticsEnabled: !state.settings.hapticsEnabled 
          }
        }));
      },

      toggleRomanization: () => {
        set(state => ({
          settings: { 
            ...state.settings, 
            showRomanization: !state.settings.showRomanization 
          }
        }));
      },
       setQuestionsPerRound: (count) => set(state => ({
    settings: {
      ...state.settings,
      questionsPerRound: count
    }
  })),

  setSoundTheme: (theme) => set(state => ({
    settings: {
      ...state.settings,
      soundTheme: theme
    }
  })),

      resetSettings: () => {
        set({ settings: DEFAULT_SETTINGS });
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);