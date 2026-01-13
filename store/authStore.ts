import { User } from '@/types/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
    loginWithUser: (user: User) => void;  // ⬅️ ДОБАВИЛИ

}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
  user: {
    id: 'user-1',
    email: 'test@example.com',
    username: 'testuser',
    nativeLanguage: 'ru',
    learningLanguage: 'ko',
    subscriptionTier: 'free',
    streakDays: 5,
    totalWordsLearned: 42,
    createdAt: new Date().toISOString(),
  },
  isAuthenticated: true,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    // Mock login
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({
      user: {
        id: 'user-1',
        email,
        username: 'testuser',
        nativeLanguage: 'ru',
        learningLanguage: 'ko',
        subscriptionTier: 'free',
        streakDays: 5,
        totalWordsLearned: 42,
        createdAt: new Date().toISOString(),
      },
      isAuthenticated: true,
      isLoading: false,
    });
  },


      loginWithUser: (user) => {
        set({ user });
      },
  setUser: (user: User) => {
    set({ user, isAuthenticated: true });
  },
    logout: () => set({ user: null }),
  }),
  {
    name: 'auth-storage',
    storage: createJSONStorage(() => AsyncStorage),
  }
),

);